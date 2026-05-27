import { useEffect, useMemo, useState } from 'react'
import CatToggleButtons from '../components/CatToggleButtons.jsx'
import DailyCard from '../components/DailyCard.jsx'
import { encryptText, hydrateDiaryEntries } from '../utils/secureText.js'
import getCatStatus from '../utils/catStatus.js'
import { getStreak, updateStreak } from '../utils/streak.js'
import { downloadDailyCard } from '../utils/downloadDailyCard.js'

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function dispatchChanged() {
  window.dispatchEvent(new Event('meowdiaries_data_changed'))
  window.dispatchEvent(new Event('meowdiaries_updated'))
}

function localISODate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function localISODateFromTimestamp(ts) {
  if (typeof ts !== 'number') return null
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function Avatar({ cat }) {
  const theme = document.documentElement.getAttribute('data-theme') || 'standard'
  const isNook = theme === 'nook'
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'

  if (cat?.photoUrl) {
    return (
      <div className="h-16 w-16 shrink-0 pixel-border bg-surface flex items-center justify-center overflow-hidden">
        <img src={cat.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }

  const base =
    variant === 'black'
      ? '#111'
      : variant === 'orange_tabby'
        ? '#d58b3c'
        : variant === 'gray_tabby'
          ? '#9aa0a6'
          : variant === 'calico'
            ? '#f2f2f2'
            : variant === 'white_graycrown'
              ? '#f2f2f2'
              : '#333'

  if (variant === 'tuxedo' || variant === 'black' || variant === 'orange_tabby' || variant === 'gray_tabby' || variant === 'calico') {
    const chest = variant === 'black' ? '#222' : '#eee'
    return (
      <div className="h-16 w-16 shrink-0 pixel-border bg-surface flex items-center justify-center">
        <div
          className="h-10 w-10"
          style={{
            background: base,
            borderRadius: isNook ? 999 : 2,
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              width: '70%',
              height: '55%',
              background: chest,
              borderRadius: isNook ? 999 : 2
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: -4,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `10px solid ${variant === 'black' ? '#0a0a0a' : '#222'}`
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 6,
              top: -4,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `10px solid ${variant === 'black' ? '#0a0a0a' : '#222'}`
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '35%',
              top: '35%',
              width: 6,
              height: 6,
              background: eye,
              borderRadius: isNook ? 999 : 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '35%',
              top: '35%',
              width: 6,
              height: 6,
              background: eye,
              borderRadius: isNook ? 999 : 1
            }}
          />
          {variant === 'orange_tabby' || variant === 'gray_tabby' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '28%',
                  top: '58%',
                  width: '44%',
                  height: 2,
                  background: colorMix(base, '#111', 0.18)
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '22%',
                  top: '66%',
                  width: '56%',
                  height: 2,
                  background: colorMix(base, '#111', 0.18)
                }}
              />
            </>
          ) : null}
          {variant === 'calico' ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '10%',
                  top: '18%',
                  width: '26%',
                  height: '22%',
                  background: '#d58b3c',
                  borderRadius: isNook ? 999 : 2,
                  opacity: 0.9
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '10%',
                  top: '44%',
                  width: '22%',
                  height: '22%',
                  background: '#222',
                  borderRadius: isNook ? 999 : 2,
                  opacity: 0.9
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="h-16 w-16 shrink-0 pixel-border bg-surface flex items-center justify-center">
      <div
        className="h-10 w-10"
        style={{
          background: base,
          borderRadius: isNook ? 999 : 2,
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '-2%',
            width: '64%',
            height: '32%',
            background: '#bebebe',
            borderRadius: isNook ? 999 : 2
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '24%',
            top: '2%',
            width: '52%',
            height: '24%',
            background: '#cecece',
            borderRadius: isNook ? 999 : 2
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6,
            top: -4,
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `10px solid #d0d0d0`
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 6,
            top: -4,
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `10px solid #d0d0d0`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '35%',
            top: '38%',
            width: 6,
            height: 6,
            background: eye,
            borderRadius: isNook ? 999 : 1
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '35%',
            top: '38%',
            width: 6,
            height: 6,
            background: eye,
            borderRadius: isNook ? 999 : 1
          }}
        />
      </div>
    </div>
  )
}

function PixelCatAvatar({ cat, size = 84 }) {
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'
  const px = Number(size) || 84

  if (cat?.photoUrl) {
    return <img src={cat.photoUrl} alt="" style={{ width: px, height: px, borderRadius: 16, objectFit: 'cover' }} />
  }

  if (variant === 'tuxedo') {
    return (
      <svg viewBox="0 0 16 16" width={px} height={px} style={{ imageRendering: 'pixelated' }} aria-hidden="true">
        <rect x="3" y="1" width="2" height="2" fill="#222" />
        <rect x="11" y="1" width="2" height="2" fill="#222" />
        <rect x="4" y="2" width="8" height="7" fill="#333" />
        <rect x="3" y="3" width="10" height="6" fill="#333" />
        <rect x="5" y="6" width="6" height="3" fill="#eee" />
        <rect x="5" y="5" width="2" height="2" fill={eye} />
        <rect x="9" y="5" width="2" height="2" fill={eye} />
        <rect x="6" y="6" width="1" height="1" fill="#111" />
        <rect x="10" y="6" width="1" height="1" fill="#111" />
        <rect x="5" y="5" width="1" height="1" fill="#fff" />
        <rect x="9" y="5" width="1" height="1" fill="#fff" />
        <rect x="7" y="7" width="2" height="1" fill="#f0a8b8" />
        <rect x="4" y="7" width="1" height="1" fill="#ffb5c8" />
        <rect x="11" y="7" width="1" height="1" fill="#ffb5c8" />
        <rect x="5" y="9" width="6" height="5" fill="#eee" />
        <rect x="4" y="10" width="2" height="4" fill="#222" />
        <rect x="10" y="10" width="2" height="4" fill="#222" />
        <rect x="6" y="14" width="1" height="1" fill="#eee" />
        <rect x="9" y="14" width="1" height="1" fill="#eee" />
      </svg>
    )
  }

  if (variant === 'white_graycrown') {
    return (
      <svg viewBox="0 0 16 16" width={px} height={px} style={{ imageRendering: 'pixelated' }} aria-hidden="true">
        <rect x="1" y="0" width="3" height="3" fill="#d0d0d0" />
        <rect x="12" y="0" width="3" height="3" fill="#d0d0d0" />
        <rect x="1" y="1" width="2" height="2" fill="#f5c8d0" />
        <rect x="13" y="1" width="2" height="2" fill="#f5c8d0" />
        <rect x="2" y="2" width="12" height="10" fill="#f2f2f2" />
        <rect x="4" y="2" width="8" height="1" fill="#b8b8b8" />
        <rect x="5" y="3" width="6" height="1" fill="#c8c8c8" />
        <rect x="3" y="5" width="3" height="3" fill={eye} />
        <rect x="10" y="5" width="3" height="3" fill={eye} />
        <rect x="4" y="6" width="2" height="2" fill="#1a1a2e" />
        <rect x="11" y="6" width="2" height="2" fill="#1a1a2e" />
        <rect x="4" y="6" width="1" height="1" fill="#fff" />
        <rect x="11" y="6" width="1" height="1" fill="#fff" />
        <rect x="7" y="8" width="2" height="1" fill="#f0a8b8" />
        <rect x="2" y="10" width="12" height="2" fill="#e0e0e0" />
      </svg>
    )
  }

  const base =
    variant === 'black'
      ? '#111'
      : variant === 'orange_tabby'
        ? '#d58b3c'
        : variant === 'gray_tabby'
          ? '#9aa0a6'
          : variant === 'calico'
            ? '#f2f2f2'
            : '#333'

  return (
    <svg viewBox="0 0 16 16" width={px} height={px} style={{ imageRendering: 'pixelated' }} aria-hidden="true">
      <rect x="2" y="2" width="12" height="10" fill={base} />
      <rect x="3" y="5" width="3" height="3" fill={eye} />
      <rect x="10" y="5" width="3" height="3" fill={eye} />
      <rect x="4" y="6" width="2" height="2" fill="#111" />
      <rect x="11" y="6" width="2" height="2" fill="#111" />
      <rect x="4" y="6" width="1" height="1" fill="#fff" />
      <rect x="11" y="6" width="1" height="1" fill="#fff" />
      {variant === 'calico' ? (
        <>
          <rect x="2" y="2" width="4" height="4" fill="#d58b3c" opacity="0.9" />
          <rect x="10" y="8" width="4" height="4" fill="#222" opacity="0.9" />
        </>
      ) : null}
      {variant === 'orange_tabby' || variant === 'gray_tabby' ? (
        <>
          <rect x="4" y="8" width="8" height="1" fill="#111" opacity="0.18" />
          <rect x="3" y="10" width="10" height="1" fill="#111" opacity="0.18" />
        </>
      ) : null}
    </svg>
  )
}

function colorMix(a, b, t) {
  function hexToRgb(h) {
    const x = h.replace('#', '')
    const v = x.length === 3 ? x.split('').map((c) => c + c).join('') : x
    const n = parseInt(v, 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
  }
  function clamp(v) {
    return Math.max(0, Math.min(255, v))
  }
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  const r = clamp(Math.round(A.r + (B.r - A.r) * t))
  const g = clamp(Math.round(A.g + (B.g - A.g) * t))
  const bb = clamp(Math.round(A.b + (B.b - A.b) * t))
  return `rgb(${r} ${g} ${bb})`
}

export default function Home() {
  const [cats, setCats] = useState(() => loadJSON('meowdiaries_cats', []))
  const [activeCatId, setActiveCatId] = useState(() => localStorage.getItem('meowdiaries_active_cat_id') || cats[0]?.id || '')
  const activeCat = cats.find((c) => c.id === activeCatId) || cats[0]

  const [logs, setLogs] = useState(() => loadJSON('meowdiaries_routine_logs', []))
  const [memoText, setMemoText] = useState('')
  const [memoDraft, setMemoDraft] = useState('')
  const [memoEditing, setMemoEditing] = useState(false)
  const [memoStatus, setMemoStatus] = useState('')
  const [photoHint, setPhotoHint] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [streakCount, setStreakCount] = useState(0)
  const [isGeneratingCard, setIsGeneratingCard] = useState(false)
  const [diaryEntries, setDiaryEntries] = useState([])
  const todayStr = localISODate()
  const [selectedDate, setSelectedDate] = useState(() => localISODate())
  const date = selectedDate

  const cardEntry = useMemo(() => {
    if (!activeCat?.id) return null
    return (Array.isArray(diaryEntries) ? diaryEntries : []).find((e) => e.date === date && String(e.catId) === String(activeCat.id)) || null
  }, [diaryEntries, activeCat?.id, date])

  const todayRoutines = activeCat?.routines || []
  const completedSet = useMemo(() => {
    const s = new Set()
    const valid = new Set((todayRoutines || []).map((r) => r.id))
    for (const l of logs) {
      if (l.date !== date) continue
      if (String(l.catId) !== String(activeCatId)) continue
      if (!valid.has(l.routineId)) continue
      s.add(l.routineId)
    }
    return s
  }, [logs, date, activeCatId, todayRoutines])

  async function loadAndHydrateEntries() {
    const raw = loadJSON('meowdiaries_diary_entries', [])
    const { entries, persistedEntries, changed } = await hydrateDiaryEntries(raw)
    if (changed) saveJSON('meowdiaries_diary_entries', persistedEntries)
    setDiaryEntries(entries)
  }

  useEffect(() => {
    if (!activeCat?.id) return
    if (memoEditing) return
    const entry = (Array.isArray(diaryEntries) ? diaryEntries : []).find((e) => e.date === date && String(e.catId) === String(activeCat.id))
    const next = (entry?.text || '').toString()
    setMemoText(next)
    setMemoDraft(next)
    setMemoStatus('')
    setPhotoHint('')
  }, [date, activeCatId, diaryEntries, memoEditing])

  useEffect(() => {
    const nextCats = loadJSON('meowdiaries_cats', [])
    setCats(nextCats)
    if (nextCats.length > 0 && !nextCats.some((c) => c.id === activeCatId)) {
      setActiveCatId(nextCats[0]?.id || '')
    }
  }, [activeCatId])

  useEffect(() => {
    function onData() {
      const nextCats = loadJSON('meowdiaries_cats', [])
      setCats(nextCats)
      setLogs(loadJSON('meowdiaries_routine_logs', []))
      void loadAndHydrateEntries()
      if (nextCats.length > 0 && !nextCats.some((c) => c.id === activeCatId)) {
        setActiveCatId(nextCats[0]?.id || '')
      }
    }
    window.addEventListener('meowdiaries_data_changed', onData)
    return () => window.removeEventListener('meowdiaries_data_changed', onData)
  }, [activeCatId])

  useEffect(() => {
    function onUpdated() {
      setLogs(loadJSON('meowdiaries_routine_logs', []))
      void loadAndHydrateEntries()
    }
    window.addEventListener('meowdiaries_updated', onUpdated)
    return () => window.removeEventListener('meowdiaries_updated', onUpdated)
  }, [])

  useEffect(() => {
    void loadAndHydrateEntries()
  }, [])

  useEffect(() => {
    if (!activeCat?.id) return
    function update() {
      const routineLogs = loadJSON('meowdiaries_routine_logs', [])
      setStatusMsg(getCatStatus(activeCat, routineLogs, new Date()))
      setStreakCount(getStreak(activeCat.id))
    }
    update()
    const interval = window.setInterval(update, 60000)
    window.addEventListener('meowdiaries_updated', update)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('meowdiaries_updated', update)
    }
  }, [activeCat])

  const dateLabel = useMemo(() => {
    const d = new Date(`${date}T00:00:00`)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
    return `${y}.${m}.${day} (${w})`
  }, [date])

  function moveDate(deltaDays) {
    const base = new Date(`${date}T00:00:00`)
    base.setDate(base.getDate() + deltaDays)
    const next = localISODateFromTimestamp(base.getTime())
    if (!next) return
    if (next > todayStr) return
    setSelectedDate(next)
  }

  function getEmptyMemoMessage() {
    const name = activeCat?.name || '야옹이'
    return `오늘 ${name}의 하루는 어땠나요? 🐾`
  }

  function toggleRoutine(routineId) {
    if (!activeCat?.id) return

    const now = Date.now()
    const storedLogsRaw = loadJSON('meowdiaries_routine_logs', [])
    const normalized = storedLogsRaw.map((l) => {
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
    const deduped = dedupedReversed.reverse()

    const newKey = `${activeCat.id}|${date}|${routineId}`
    const didAdd = !seen.has(newKey)
    let nextLogs = deduped
    if (seen.has(newKey)) {
      nextLogs = deduped.filter((l) => `${l.catId}|${l.date}|${l.routineId}` !== newKey)
    } else {
      nextLogs = [
        ...deduped,
        {
          id: crypto.randomUUID(),
          routineId,
          catId: activeCat.id,
          date,
          completedAt: now
        }
      ]
    }

    setLogs(nextLogs)
    saveJSON('meowdiaries_routine_logs', nextLogs)
    if (didAdd) updateStreak(activeCat.id)
    setStatusMsg(getCatStatus(activeCat, nextLogs, new Date()))
    setStreakCount(getStreak(activeCat.id))

    const todayCompletedLogs = nextLogs.filter((l) => l.catId === activeCat.id && l.date === date)
    const routinesDone = new Set(todayCompletedLogs.map((l) => l.routineId)).size
    const routinesTotal = (activeCat.routines || []).length

    const entries = JSON.parse(localStorage.getItem('meowdiaries_diary_entries') || '[]')
    const idx = entries.findIndex((e) => e.date === date && e.catId === activeCat.id)

    const legacyIdx = entries.findIndex((e) => {
      if (!e || e.catId !== activeCat.id) return false
      if (e.date === date) return false
      const derived = localISODateFromTimestamp(e.createdAt)
      return derived === date && (e.text || '') === '' && Array.isArray(e.photoUrls) && e.photoUrls.length === 0
    })

    if (idx >= 0) {
      entries[idx] = { ...entries[idx], routinesDone, routinesTotal }
      if (legacyIdx >= 0 && legacyIdx !== idx) {
        entries.splice(legacyIdx, 1)
      }
    } else if (legacyIdx >= 0) {
      entries[legacyIdx] = { ...entries[legacyIdx], date, catId: activeCat.id, routinesDone, routinesTotal }
    } else {
      const createdAt = Date.now()
      entries.push({
        id: String(createdAt),
        date,
        catId: activeCat.id,
        text: '',
        photoUrls: [],
        routinesDone,
        routinesTotal,
        createdAt
      })
    }

    localStorage.setItem('meowdiaries_diary_entries', JSON.stringify(entries))
    dispatchChanged()
  }

  function openMemoEdit({ scroll } = {}) {
    setMemoDraft(memoText)
    setMemoEditing(true)
    setMemoStatus('')
    setPhotoHint('')
    if (scroll) {
      document.getElementById('home_memo_card')?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    }
    window.setTimeout(() => document.getElementById('home_memo_editor')?.focus?.(), 0)
  }

  function cancelMemoEdit() {
    setMemoDraft(memoText)
    setMemoEditing(false)
    setMemoStatus('')
    setPhotoHint('')
  }

  async function saveMemoDraft() {
    if (!activeCat?.id) return

    const text = String(memoDraft ?? '')
    const trimmed = text.trim()
    const entries = loadJSON('meowdiaries_diary_entries', [])
    const now = Date.now()
    const total = todayRoutines.length
    const idx = entries.findIndex((e) => e.date === date && e.catId === activeCat.id)

    if (!trimmed && idx < 0) {
      setMemoText('')
      setMemoEditing(false)
      return
    }

    const textEnc = trimmed ? await encryptText(text) : ''
    if (idx >= 0) {
      const prev = entries[idx]
      entries[idx] = { ...prev, text: '', textEnc, routinesDone: completedSet.size, routinesTotal: total, date, catId: activeCat.id }
    } else {
      entries.push({
        id: now,
        date,
        catId: activeCat.id,
        text: '',
        textEnc,
        photoUrls: [],
        routinesDone: completedSet.size,
        routinesTotal: total,
        createdAt: now
      })
    }

    saveJSON('meowdiaries_diary_entries', entries)
    setMemoText(trimmed ? text : '')
    setMemoEditing(false)
    void loadAndHydrateEntries()
    dispatchChanged()
    setMemoStatus(trimmed ? '기록했어요 🐾' : '지웠어요 🐾')
    window.setTimeout(() => setMemoStatus(''), 1800)
  }

  async function handleCameraClick() {
    if (!activeCat?.id) return
    if (isGeneratingCard) return
    setIsGeneratingCard(true)
    setPhotoHint('카드 저장 중...')
    await new Promise((r) => window.setTimeout(r, 120))
    await downloadDailyCard(activeCat.name, date)
    setIsGeneratingCard(false)
    window.setTimeout(() => setPhotoHint(''), 1200)
  }

  return (
    <div className="space-y-4">
      <section style={{ paddingTop: 16 }}>
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <CatToggleButtons
            cats={cats}
            activeCatId={activeCat?.id}
            onSelect={(id) => {
              setActiveCatId(id)
              localStorage.setItem('meowdiaries_active_cat_id', String(id))
              dispatchChanged()
            }}
            size={24}
          />
        </div>
      </section>

      {activeCat ? (
        <section className="pixel-card" style={{ marginLeft: 20, marginRight: 20, padding: 18 }}>
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 16,
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PixelCatAvatar cat={activeCat} size={72} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[20px] font-bold text-text truncate">{activeCat.name}</div>
                {streakCount >= 3 ? (
                  <span
                    className={streakCount >= 7 ? 'streak-pulse' : undefined}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      marginLeft: '6px'
                    }}
                  >
                    🔥 {streakCount}일 연속
                  </span>
                ) : null}
              </div>
              <div key={statusMsg} className="status-msg mt-1 text-[14px] leading-snug" style={{ color: 'var(--muted)' }}>
                {statusMsg}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        style={{
          marginLeft: 20,
          marginRight: 20,
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div className="flex items-center gap-2 text-[14px] font-semibold text-text">
          <span aria-hidden="true">📅</span>
          <span>{dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[16px]" style={{ color: 'var(--muted)' }}>
          <button type="button" className="h-11 w-11" aria-label="이전 날짜" onClick={() => moveDate(-1)}>
            ‹
          </button>
          <button
            type="button"
            className="h-11 w-11"
            aria-label="다음 날짜"
            onClick={() => moveDate(1)}
            disabled={date === todayStr}
            style={{
              opacity: date === todayStr ? 0.35 : 1,
              cursor: date === todayStr ? 'not-allowed' : 'pointer'
            }}
          >
            ›
          </button>
        </div>
      </section>

      <section className="pixel-card" style={{ marginLeft: 20, marginRight: 20, padding: 16 }}>
        <div className="flex items-center gap-3">
          <div className="text-[15px] font-bold text-text">오늘의 루틴</div>
          <div className="ml-auto text-[13px]" style={{ color: 'var(--muted)' }}>
            {completedSet.size} / {todayRoutines.length} 완료
          </div>
        </div>
        <div className="mt-3">
          {todayRoutines.map((r, idx) => {
            const done = completedSet.has(r.id)
            return (
              <div
                key={r.id}
                style={{
                  padding: done ? '11px 8px' : '11px 0',
                  borderBottom: idx === todayRoutines.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderRadius: done ? 'var(--radius-xs)' : 0,
                  background: done ? 'var(--green-soft)' : 'transparent',
                  opacity: done ? 0.55 : 1
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0
                  }}
                  aria-hidden="true"
                >
                  {r.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[12px]" style={{ color: 'var(--muted)' }}>
                    {r.time}
                  </span>
                  <div className="text-[15px] font-semibold text-text truncate">{r.name}</div>
                  <div className="text-[12px] truncate" style={{ color: 'var(--muted)' }}>
                    {r.sub}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRoutine(r.id)}
                  aria-label={done ? '완료 취소' : '완료'}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    flexShrink: 0,
                    background: done ? 'var(--green)' : 'transparent',
                    color: done ? '#fff' : 'var(--muted)',
                    border: done ? 'none' : '2px solid var(--border-strong)'
                  }}
                >
                  {done ? '✓' : ''}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section id="home_memo_card" className="pixel-card" style={{ marginLeft: 20, marginRight: 20, padding: 16, paddingBottom: 16 }}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] font-bold text-text">오늘의 메모</div>
          <div className="flex items-center gap-3 text-[18px]" style={{ color: 'var(--muted)' }}>
            <button
              type="button"
              onClick={() => void handleCameraClick()}
              aria-label="오늘 데일리 카드 저장"
              disabled={isGeneratingCard}
              style={{
                opacity: isGeneratingCard ? 0.6 : 1,
                cursor: isGeneratingCard ? 'not-allowed' : 'pointer'
              }}
            >
              {isGeneratingCard ? '⏳' : '📷'}
            </button>
            <button type="button" aria-label="메모 옵션">
              ⋮
            </button>
          </div>
        </div>

        {memoEditing ? (
          <div style={{ marginTop: 12 }}>
            <textarea
              id="home_memo_editor"
              value={memoDraft}
              onChange={(e) => setMemoDraft(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                minHeight: 80,
                resize: 'none',
                borderRadius: 14,
                padding: 12,
                border: '1px solid var(--border)',
                fontSize: 15,
                lineHeight: 1.5,
                background: 'var(--surface)',
                outline: 'none',
                color: 'var(--text)'
              }}
              aria-label="오늘의 메모 작성"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void saveMemoDraft()}
                className="pixel-btn px-4 py-3 text-[14px] flex-1"
                style={{ background: 'var(--accent)', borderColor: 'transparent', color: '#fff', boxShadow: 'var(--shadow-card)' }}
              >
                저장
              </button>
              <button
                type="button"
                onClick={cancelMemoEdit}
                className="pixel-btn px-4 py-3 text-[14px] flex-1"
                style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted)', boxShadow: 'none' }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 220, maxWidth: 220 }}>
                <button
                  type="button"
                  onClick={() => openMemoEdit({ scroll: false })}
                  aria-label="메모 적기"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#FFFDFB',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 18,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, textAlign: 'center', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                    {memoText.trim() ? memoText.trim() : getEmptyMemoMessage()}
                  </div>
                </button>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -10,
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid rgba(0,0,0,0.05)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -9,
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '9px solid transparent',
                    borderRight: '9px solid transparent',
                    borderTop: '9px solid #FFFDFB'
                  }}
                />
              </div>
            </div>

            {activeCat ? (
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 72, height: 72 }}>
                  <PixelCatAvatar cat={activeCat} size={72} />
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => openMemoEdit({ scroll: false })}
              style={{
                margin: '14px auto 0',
                display: 'block',
                padding: memoText.trim() ? '9px 16px' : '10px 20px',
                borderRadius: 999,
                background: memoText.trim() ? 'transparent' : 'var(--accent)',
                color: memoText.trim() ? 'var(--muted)' : '#fff',
                fontSize: memoText.trim() ? 13 : 14,
                fontWeight: 600,
                border: memoText.trim() ? '1px solid var(--border)' : 'none',
                boxShadow: memoText.trim() ? 'none' : 'var(--shadow-card)'
              }}
            >
              {memoText.trim() ? '수정하기' : '오늘 메모 남기기'}
            </button>
          </div>
        )}

        {photoHint ? (
          <div className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
            {photoHint}
          </div>
        ) : null}
        {memoStatus ? (
          <div className="mt-2 text-sm" style={{ color: 'var(--green)' }}>
            {memoStatus}
          </div>
        ) : null}

      </section>

      {activeCat ? <DailyCard cat={activeCat} date={date} routineLogs={logs} diaryEntry={cardEntry} streak={streakCount} /> : null}

      <button
        type="button"
        onClick={() => openMemoEdit({ scroll: true })}
        aria-label="메모로 이동"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 88,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#fff',
          fontSize: 28,
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          zIndex: 100
        }}
      >
        +
      </button>
    </div>
  )
}

