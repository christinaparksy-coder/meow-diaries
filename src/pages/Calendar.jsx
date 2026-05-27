import { useEffect, useMemo, useState } from 'react'
import CatToggleButtons from '../components/CatToggleButtons.jsx'
import { hydrateDiaryEntries } from '../utils/secureText.js'
import { getEmptyMemoMessage } from '../utils/emptyMemo.js'

function iso(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function monthLabel(d) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}

function formatKoreanDate(isoStr) {
  if (!isoStr || typeof isoStr !== 'string') return ''
  const [y, m, d] = isoStr.split('-').map((x) => Number(x))
  if (!Number.isFinite(m) || !Number.isFinite(d)) return isoStr
  return `${m}월 ${d}일`
}

function hhmmFromTimestamp(ts) {
  if (typeof ts !== 'number') return ''
  const d = new Date(ts)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export default function Calendar() {
  const [cats, setCats] = useState([])
  const [logs, setLogs] = useState([])
  const [diaryEntries, setDiaryEntries] = useState([])
  const [activeCatId, setActiveCatId] = useState(null)

  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selected, setSelected] = useState(() => iso(new Date()))

  async function loadAll() {
    const nextCats = safeParse(localStorage.getItem('meowdiaries_cats') || '[]', [])
    setCats(nextCats)
    const firstId = nextCats[0]?.id || null
    setActiveCatId((prev) => {
      const keep = prev && nextCats.some((c) => String(c.id) === String(prev))
      return keep ? prev : firstId
    })
    setLogs(safeParse(localStorage.getItem('meowdiaries_routine_logs') || '[]', []))
    const rawEntries = safeParse(localStorage.getItem('meowdiaries_diary_entries') || '[]', [])
    const { entries, persistedEntries, changed } = await hydrateDiaryEntries(rawEntries)
    if (changed) localStorage.setItem('meowdiaries_diary_entries', JSON.stringify(persistedEntries))
    setDiaryEntries(entries)
  }

  useEffect(() => {
    const handleStorage = () => void loadAll()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('meowdiaries_updated', handleStorage)
    void loadAll()
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('meowdiaries_updated', handleStorage)
    }
  }, [])

  const activeCat = cats.find((c) => String(c.id) === String(activeCatId)) || cats[0]
  const validRoutineIds = useMemo(() => new Set((activeCat?.routines || []).map((r) => r.id)), [activeCat?.routines])

  const routineLookup = useMemo(() => {
    const m = new Map()
    for (const c of cats) {
      for (const r of c.routines || []) m.set(`${c.id}:${r.id}`, { ...r, catId: c.id, catName: c.name })
    }
    return m
  }, [cats])

  const logsByDate = useMemo(() => {
    const m = new Map()
    const filtered = (Array.isArray(logs) ? logs : []).filter((l) => String(l.catId) === String(activeCat?.id))
    for (const l of filtered) {
      if (!validRoutineIds.has(l.routineId)) continue
      if (!m.has(l.date)) m.set(l.date, [])
      m.get(l.date).push(l)
    }
    return m
  }, [logs, activeCat?.id, validRoutineIds])

  const memoByDate = useMemo(() => {
    const s = new Set()
    for (const e of diaryEntries) {
      if (!e?.date) continue
      if (String(e.catId) !== String(activeCat?.id)) continue
      if ((e.text || '').trim()) s.add(e.date)
    }
    return s
  }, [diaryEntries, activeCat?.id])

  const photoByDate = useMemo(() => {
    const s = new Set()
    for (const e of diaryEntries) {
      if (!e?.date) continue
      if (String(e.catId) !== String(activeCat?.id)) continue
      if (Array.isArray(e.photoUrls) && e.photoUrls.length > 0) s.add(e.date)
    }
    return s
  }, [diaryEntries, activeCat?.id])

  const today = iso(new Date())

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const first = new Date(year, month, 1)
    const startDay = first.getDay()
    const start = new Date(year, month, 1 - startDay)
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [cursor])

  function dayStatus(dateISO) {
    const dayLogs = logsByDate.get(dateISO) || []
    const hasMemo = memoByDate.has(dateISO)
    if (dayLogs.length === 0 && !hasMemo) return { kind: 'none', done: 0, total: (activeCat?.routines || []).length }
    const uniq = new Set(dayLogs.map((l) => l.routineId))
    const done = uniq.size
    const total = (activeCat?.routines || []).length
    if (total > 0 && done >= total) return { kind: 'all', done, total }
    return { kind: hasMemo || done > 0 ? 'partial' : 'none', done, total }
  }

  const selectedLogs = useMemo(() => {
    if (!activeCat?.id) return []
    return (Array.isArray(logs) ? logs : []).filter(
      (l) => l.date === selected && String(l.catId) === String(activeCat.id) && validRoutineIds.has(l.routineId)
    )
  }, [logs, selected, activeCat?.id, validRoutineIds])

  const selectedRoutines = useMemo(() => {
    const map = new Map()
    for (const l of selectedLogs) {
      const r = routineLookup.get(`${l.catId}:${l.routineId}`)
      if (!r) continue
      const prev = map.get(r.id)
      if (!prev || (l.completedAt || 0) > (prev.completedAt || 0)) {
        map.set(r.id, { ...r, completedAt: l.completedAt })
      }
    }
    return Array.from(map.values()).sort((a, b) => (a.completedAt || 0) - (b.completedAt || 0))
  }, [selectedLogs, routineLookup])

  const selectedMemo = useMemo(() => {
    if (!activeCat?.id) return null
    const es = (Array.isArray(diaryEntries) ? diaryEntries : []).filter((e) => e.date === selected && String(e.catId) === String(activeCat.id))
    if (es.length === 0) return null
    return es.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
  }, [diaryEntries, selected, activeCat?.id])

  const selectedDone = useMemo(() => new Set(selectedLogs.map((l) => l.routineId)).size, [selectedLogs])
  const selectedTotal = (activeCat?.routines || []).length
  const isSelectedAllDone = selectedTotal > 0 && selectedDone >= selectedTotal
  const selectedHasMemo = Boolean((selectedMemo?.text || '').trim())
  const selectedHasPhoto = Array.isArray(selectedMemo?.photoUrls) && selectedMemo.photoUrls.length > 0

  const memoPreview = useMemo(() => {
    if (!selectedMemo) return ''
    return selectedMemo.text && selectedMemo.text.trim() !== '' ? selectedMemo.text : getEmptyMemoMessage(selectedMemo, activeCat?.name || '')
  }, [selectedMemo, activeCat?.name])

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between px-1">
        <button
          type="button"
          className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          aria-label="이전 달"
        >
          ◀
        </button>
        <div className="font-main text-[12px] text-text/90">{monthLabel(cursor)}</div>
        <button
          type="button"
          className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="다음 달"
        >
          ▶
        </button>
      </section>

      <section>
        <CatToggleButtons cats={cats} activeCatId={activeCat?.id} onSelect={(id) => setActiveCatId(id)} size={28} />
      </section>

      <section
        className="bg-card border border-border/20 rounded-[12px] p-4"
        style={{ boxShadow: '0 10px 24px rgba(0,0,0,0.06)' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            alignItems: 'start'
          }}
        >
          {['일', '월', '화', '수', '목', '금', '토'].map((w, idx) => (
            <div
              key={w}
              className="font-body"
              style={{
                fontSize: 12,
                color: idx === 0 ? '#FF6B6B' : idx === 6 ? 'var(--blue)' : 'var(--muted)',
                textAlign: 'center',
                padding: '6px 0'
              }}
            >
              {w}
            </div>
          ))}
        </div>

        <div
          className="mt-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px 0',
            alignItems: 'start'
          }}
        >
          {days.map((d) => {
            const dateISO = iso(d)
            const inMonth = d.getMonth() === cursor.getMonth()
            const status = dayStatus(dateISO)
            const isSelected = dateISO === selected
            const isToday = dateISO === today

            const hasMemo = inMonth && memoByDate.has(dateISO)
            const hasPhoto = inMonth && photoByDate.has(dateISO)
            const total = status.total || 0
            const done = status.done || 0
            const allRoutinesDone = inMonth && total > 0 && done >= total
            const someRoutinesDone = inMonth && total > 0 && done > 0 && done < total

            return (
              <button
                key={dateISO}
                type="button"
                onClick={() => setSelected(dateISO)}
                className="transition-colors"
                style={{
                  background: 'transparent',
                  padding: 0,
                  border: 'none'
                }}
                aria-label={`${formatKoreanDate(dateISO)}`}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: 40,
                    minHeight: 48,
                    padding: '4px 0',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: 14,
                      fontWeight: isToday ? 700 : 500,
                      background: isSelected ? 'var(--accent)' : isToday ? 'var(--accent-soft)' : 'transparent',
                      color: isSelected
                        ? '#fff'
                        : isToday
                          ? 'var(--accent)'
                          : inMonth
                            ? 'var(--text)'
                            : 'var(--muted)',
                      border: isSelected ? 'none' : isToday ? '1.5px solid var(--accent)' : 'none',
                      opacity: inMonth ? 1 : 0.35
                    }}
                  >
                    {d.getDate()}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      marginTop: 3,
                      height: 8,
                      minWidth: 24
                    }}
                  >
                    {allRoutinesDone ? <span style={{ fontSize: 8, lineHeight: 1 }}>⭐</span> : null}
                    {!allRoutinesDone && someRoutinesDone ? (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF82' }} />
                    ) : null}
                    {hasMemo ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB5C8' }} /> : null}
                    {hasPhoto ? <span style={{ fontSize: 8, lineHeight: 1 }}>📷</span> : null}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="font-main text-[14px] text-text">{formatKoreanDate(selected)}</div>
        </div>

        <div className="text-sm text-text/80">
          <span className="font-body">
            루틴 {selectedDone}/{selectedTotal} 완료
          </span>
          {isSelectedAllDone ? <span className="ml-2 text-[12px]">✨</span> : null}
        </div>

        <div className="bg-card border border-border/20 rounded-[14px] p-4" style={{ boxShadow: '0 14px 30px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="font-main text-[11px] text-accent">메모</div>
            {selectedHasPhoto ? <div className="text-xs text-muted">📷</div> : null}
          </div>

          <div className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">
            {selectedMemo ? memoPreview : null}
          </div>

          {selectedHasPhoto ? (
            <div className="mt-4 flex gap-2">
              {selectedMemo.photoUrls.slice(0, 1).map((url) => (
                <div key={url} className="h-16 w-16 overflow-hidden rounded-[10px] border border-border/15 bg-surface">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {selectedRoutines.length > 0 ? (
          <div className="space-y-2">
            {selectedRoutines.slice(0, 4).map((r) => (
              <div key={`${r.catId}:${r.id}`} className="flex items-center gap-2 text-sm text-text/85">
                <div className="w-12 text-xs text-muted">{hhmmFromTimestamp(r.completedAt)}</div>
                <div className="text-base">{r.emoji}</div>
                <div className="min-w-0 flex-1 truncate">{r.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted">이 날은 조용히 지나갔어요.</div>
        )}
      </section>
    </div>
  )
}

