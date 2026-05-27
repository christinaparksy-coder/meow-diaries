import { useEffect, useState } from 'react'
import CatToggleButtons from '../components/CatToggleButtons.jsx'
import { encryptText, hydrateDiaryEntries } from '../utils/secureText.js'
import { getEmptyMemoMessage } from '../utils/emptyMemo.js'

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function localISODateFromTimestamp(ts) {
  if (typeof ts !== 'number') return null
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function normalizeAndDedupLogs(rawLogs) {
  const normalized = (Array.isArray(rawLogs) ? rawLogs : []).map((l) => {
    const derived = localISODateFromTimestamp(l?.completedAt)
    if (derived && l?.date !== derived) return { ...l, date: derived }
    return l
  })

  const dedupedReversed = []
  const seen = new Set()
  for (let i = normalized.length - 1; i >= 0; i--) {
    const l = normalized[i]
    if (!l) continue
    const key = `${l.catId}|${l.date}|${l.routineId}`
    if (seen.has(key)) continue
    seen.add(key)
    dedupedReversed.push(l)
  }
  return dedupedReversed.reverse()
}

function dispatchChanged() {
  window.dispatchEvent(new Event('meowdiaries_updated'))
}

export default function Diary() {
  const [entries, setEntries] = useState([])
  const [cats, setCats] = useState([])
  const [activeCatId, setActiveCatId] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [draftText, setDraftText] = useState('')

  async function loadEntries() {
    const nextCats = loadJSON('meowdiaries_cats', [])
    setCats(Array.isArray(nextCats) ? nextCats : [])
    const firstId = Array.isArray(nextCats) ? nextCats[0]?.id : null
    setActiveCatId((prev) => {
      const keep = prev && Array.isArray(nextCats) && nextCats.some((c) => String(c.id) === String(prev))
      return keep ? prev : firstId || null
    })
    const totals = new Map((Array.isArray(nextCats) ? nextCats : []).map((c) => [c.id, (c.routines || []).length]))
    const validByCat = new Map((Array.isArray(nextCats) ? nextCats : []).map((c) => [c.id, new Set((c.routines || []).map((r) => r.id))]))

    const rawLogs = loadJSON('meowdiaries_routine_logs', [])
    const nextLogs = normalizeAndDedupLogs(rawLogs)
    const logsStr = JSON.stringify(nextLogs)
    if (localStorage.getItem('meowdiaries_routine_logs') !== logsStr) {
      localStorage.setItem('meowdiaries_routine_logs', logsStr)
    }

    const rawEntries = loadJSON('meowdiaries_diary_entries', [])
    const corrected = (Array.isArray(rawEntries) ? rawEntries : []).map((e) => {
      const routinesTotal = totals.get(e?.catId) ?? Number(e?.routinesTotal || 0)
      const valid = validByCat.get(e?.catId) || new Set()
      const done = new Set(
        nextLogs.filter((l) => l.catId === e?.catId && l.date === e?.date && valid.has(l.routineId)).map((l) => l.routineId)
      ).size
      if (Number(e?.routinesDone || 0) === done && Number(e?.routinesTotal || 0) === routinesTotal) return e
      return { ...e, routinesDone: done, routinesTotal }
    })

    const { entries: hydrated, persistedEntries } = await hydrateDiaryEntries(corrected)
    const entriesStr = JSON.stringify(persistedEntries)
    if (localStorage.getItem('meowdiaries_diary_entries') !== entriesStr) {
      localStorage.setItem('meowdiaries_diary_entries', entriesStr)
    }
    setEntries(hydrated)
  }

  useEffect(() => {
    const handleStorage = () => void loadEntries()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('meowdiaries_updated', handleStorage)
    void loadEntries()
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('meowdiaries_updated', handleStorage)
    }
  }, [])

  const activeCat = cats.find((c) => String(c.id) === String(activeCatId)) || cats[0]
  const activeName = activeCat?.name || ''
  const filteredEntries = entries.filter((e) => String(e.catId) === String(activeCat?.id))

  function openEdit(entry) {
    setEditingId(String(entry.id))
    setDraftText(entry.text || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftText('')
  }

  async function saveEdit(entryId) {
    const next = loadJSON('meowdiaries_diary_entries', [])
    const idx = next.findIndex((e) => String(e.id) === String(entryId))
    if (idx < 0) return
    const plain = String(draftText ?? '')
    const textEnc = plain.trim() ? await encryptText(plain) : ''
    next[idx] = { ...next[idx], text: '', textEnc }
    localStorage.setItem('meowdiaries_diary_entries', JSON.stringify(next))
    dispatchChanged()
    cancelEdit()
  }

  return (
    <div className="space-y-4">
      <header className="pixel-card p-4 flex items-center justify-between">
        <div>
          <div className="font-main text-[12px]">다이어리</div>
          <div className="mt-1 text-xs text-muted">최신 기록이 위에 보여요</div>
        </div>
      </header>

      <div className="pixel-card p-3">
        <CatToggleButtons cats={cats} activeCatId={activeCat?.id} onSelect={(id) => setActiveCatId(id)} size={28} />
      </div>

      <div className="border-t border-border/40" />
      <div className="font-main text-[12px] text-accent">{activeName ? `${activeName}의 하루들` : '하루들'}</div>
      <div className="border-t border-border/40" />

      {!activeCat ? (
        <div className="pixel-card p-6 text-sm text-text/90">고양이를 먼저 추가해 주세요 🐾</div>
      ) : filteredEntries.length === 0 ? (
        <div className="pixel-card p-6 text-sm text-text/90">아직 {activeName}의 기록이 없어요 🐾</div>
      ) : (
        <div className="space-y-3">
          {filteredEntries
            .slice()
            .sort((a, b) => {
              const ad = String(a.date || '')
              const bd = String(b.date || '')
              if (ad !== bd) return bd.localeCompare(ad)
              return (b.createdAt || 0) - (a.createdAt || 0)
            })
            .map((e) => {
              const isEditing = String(editingId) === String(e.id)
              const memoText = e.text && e.text.trim() !== '' ? e.text : getEmptyMemoMessage(e, activeName)
              return (
                <div key={e.id} className="pixel-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-main text-[10px] text-muted">{e.date}</div>

                      {isEditing ? (
                        <div className="mt-2">
                          <textarea
                            className="meow-field resize-none p-3 text-sm"
                            rows={4}
                            value={draftText}
                            onChange={(ev) => setDraftText(ev.target.value)}
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => saveEdit(e.id)}
                              className="pixel-btn px-3 py-2 text-[10px] font-main border-accent bg-card"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm whitespace-pre-wrap">{memoText}</div>
                      )}

                      {Array.isArray(e.photoUrls) && e.photoUrls.length > 0 ? (
                        <div className="mt-3 flex gap-2">
                          {e.photoUrls.slice(0, 3).map((url, i) => (
                            <div key={`${url}-${i}`} className="h-12 w-12 pixel-border bg-surface overflow-hidden">
                              <img src={url} alt="" className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(e)}
                        className="pixel-btn px-2 py-2 text-[10px] font-main border-border bg-surface text-muted"
                        aria-label="메모 수정"
                      >
                        ✏️
                      </button>
                      <div className="pixel-border bg-surface px-2 py-1 text-[10px] text-muted">
                        루틴 {e.routinesDone}/{e.routinesTotal} 완료
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      <button
        type="button"
        className="fixed bottom-[88px] right-4 pixel-btn h-12 w-12 text-xl font-main border-accent bg-card"
        aria-label="새 메모 추가"
      >
        +
      </button>
    </div>
  )
}

