import { useMemo, useState, useSyncExternalStore } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Calendar from './pages/Calendar.jsx'
import Routines from './pages/Routines.jsx'
import Diary from './pages/Diary.jsx'
import MyPage from './pages/MyPage.jsx'
import AddCatFlow from './components/AddCatFlow.jsx'

function IconHamburger(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function NavIconHome({ active }) {
  return active ? (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 3l9 8v10a2 2 0 01-2 2h-5v-7H10v7H5a2 2 0 01-2-2V11l9-8z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v11a2 2 0 002 2h3v-7h4v7h3a2 2 0 002-2V10" />
    </svg>
  )
}

function NavIconCalendar({ active }) {
  return active ? (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V2zm14 8H3v10h18V10z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 2v3M17 2v3" />
      <path d="M3 8h18" />
      <path d="M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  )
}

function NavIconClock({ active }) {
  return active ? (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h4v2h-6V7h2z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  )
}

function NavIconBook({ active }) {
  return active ? (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M4 3h12a3 3 0 013 3v15a2 2 0 00-2-2H4a2 2 0 00-2 2V5a2 2 0 012-2z" />
      <path d="M19 19V6a3 3 0 00-3-3H6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 3h12a3 3 0 013 3v15a2 2 0 00-2-2H4a2 2 0 00-2 2V5a2 2 0 012-2z" />
      <path d="M8 7h8M8 11h8M8 15h6" />
    </svg>
  )
}

function NavIconPaw({ active }) {
  return active ? (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 14c3.5 0 6 2.2 6 5 0 2-1.6 3-3.6 3H9.6C7.6 22 6 21 6 19c0-2.8 2.5-5 6-5z" />
      <path d="M7.5 12a1.8 1.8 0 110-3.6A1.8 1.8 0 017.5 12zm9 0a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zM10 8a1.6 1.6 0 110-3.2A1.6 1.6 0 0110 8zm4 0a1.6 1.6 0 110-3.2A1.6 1.6 0 0114 8z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 14c3.5 0 6 2.2 6 5 0 2-1.6 3-3.6 3H9.6C7.6 22 6 21 6 19c0-2.8 2.5-5 6-5z" />
      <path d="M7.5 12a1.8 1.8 0 110-3.6A1.8 1.8 0 017.5 12zm9 0a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zM10 8a1.6 1.6 0 110-3.2A1.6 1.6 0 0110 8zm4 0a1.6 1.6 0 110-3.2A1.6 1.6 0 0114 8z" />
    </svg>
  )
}

function IconBell(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

function IconSettings(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
      <path d="M19.4 15a7.95 7.95 0 00.1-1 7.95 7.95 0 00-.1-1l2-1.5-2-3.5-2.4 1a8.2 8.2 0 00-1.7-1l-.4-2.6H9.1L8.7 7a8.2 8.2 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7.95 7.95 0 00-.1 1 7.95 7.95 0 00.1 1l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 001.7 1l.4 2.6h5.8l.4-2.6a8.2 8.2 0 001.7-1l2.4 1 2-3.5-2-1.5z" />
    </svg>
  )
}

function dispatchChanged() {
  window.dispatchEvent(new Event('meowdiaries_data_changed'))
}

function subscribe(cb) {
  window.addEventListener('meowdiaries_data_changed', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('meowdiaries_data_changed', cb)
    window.removeEventListener('storage', cb)
  }
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function toMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null
  const [h, m] = hhmm.split(':').map((x) => Number(x))
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

const tabs = [
  { key: 'home', label: '홈', path: '/home' },
  { key: 'calendar', label: '달력', path: '/calendar' },
  { key: 'routines', label: '루틴', path: '/routines' },
  { key: 'diary', label: '다이어리', path: '/diary' },
  { key: 'my', label: '마이', path: '/my' }
]

export default function App({ onThemeChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('meowdiaries_theme') || ''
    return ['standard', 'pixel', 'nook', 'dreamy'].includes(stored) ? stored : 'standard'
  })
  const [notifOpen, setNotifOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(() => (localStorage.getItem('meowdiaries_notifications_enabled') ?? 'true') === 'true')
  const [settingsMsg, setSettingsMsg] = useState('')
  const [lang, setLang] = useState('KR')
  const [resetConfirm, setResetConfirm] = useState(false)

  const catsRaw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('meowdiaries_cats') || '[]',
    () => localStorage.getItem('meowdiaries_cats') || '[]'
  )
  const cats = useMemo(() => safeParse(catsRaw), [catsRaw])
  const needsFirstCat = cats.length === 0

  const activeKey = useMemo(() => {
    const t = tabs.find((x) => location.pathname.startsWith(x.path))
    return t?.key || 'home'
  }, [location.pathname])

  function setAndApplyTheme(next) {
    const v = String(next || '')
    const t = ['standard', 'pixel', 'nook', 'dreamy'].includes(v) ? v : 'standard'
    setTheme(t)
    onThemeChange?.(t)
  }

  const upcomingRoutines = useMemo(() => {
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const list = []
    for (const c of cats) {
      for (const r of c.routines || []) {
        const m = toMinutes(r.time)
        if (m === null) continue
        if (m >= nowMin) list.push({ time: r.time, name: r.name, emoji: r.emoji, catName: c.name })
      }
    }
    return list.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }, [catsRaw])

  function openNotifications() {
    setSettingsOpen(false)
    setSettingsMsg('')
    setResetConfirm(false)
    setNotifEnabled((localStorage.getItem('meowdiaries_notifications_enabled') ?? 'true') === 'true')
    setNotifOpen(true)
  }

  function openSettings() {
    setNotifOpen(false)
    setSettingsMsg('')
    setResetConfirm(false)
    setSettingsOpen(true)
  }

  function toggleNotifications() {
    const next = !notifEnabled
    setNotifEnabled(next)
    localStorage.setItem('meowdiaries_notifications_enabled', next ? 'true' : 'false')
    dispatchChanged()
  }

  function clearAllData() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('meowdiaries_'))
    for (const k of keys) localStorage.removeItem(k)
    window.location.reload()
  }

  return (
    <div className="min-h-dvh bg-bg text-text font-body">
      <AddCatFlow open={needsFirstCat} required onClose={() => {}} />
      <header
        className="hud-bar fixed top-0 left-0 right-0"
        style={{
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[390px] items-center justify-between px-5">
          <button type="button" className="hud-btn p-2" aria-label="메뉴">
            <IconHamburger />
          </button>
          <div className="text-center leading-tight">
            <div className="font-main text-[18px] font-bold text-text">야옹일기</div>
            <span className="font-main text-[11px] text-muted block">Meow Diaries</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="hud-btn p-2" aria-label="알림 설정" onClick={openNotifications}>
              <IconBell />
            </button>
            <button type="button" className="hud-btn p-2" aria-label="설정" onClick={openSettings}>
              <IconSettings />
            </button>
          </div>
        </div>
      </header>

      {notifOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setNotifOpen(false)} />
          <div className="absolute left-0 right-0 top-[52px]">
            <div className="mx-auto w-full max-w-[520px] px-4">
              <div className="pixel-card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-main text-[11px]">알림 설정</div>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted"
                  >
                    닫기
                  </button>
                </div>

                <div className="mt-3 pixel-border bg-surface p-3 flex items-center justify-between gap-3">
                  <div className="text-sm">루틴 알림 받기</div>
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    className={[
                      'pixel-btn px-3 py-2 text-[10px] font-main',
                      notifEnabled ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                    ].join(' ')}
                    aria-pressed={notifEnabled}
                  >
                    {notifEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="mt-3">
                  <div className="font-main text-[10px] text-muted">오늘 예정 루틴</div>
                  {upcomingRoutines.length === 0 ? (
                    <div className="mt-2 text-sm text-text/80">오늘 예정된 루틴이 없어요.</div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {upcomingRoutines.slice(0, 8).map((r, i) => (
                        <div key={`${r.time}-${r.name}-${i}`} className="pixel-border bg-surface p-3 flex items-center gap-3">
                          <div className="w-12 font-main text-[10px] text-muted">{r.time}</div>
                          <div className="text-base">{r.emoji}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm truncate">{r.name}</div>
                            <div className="text-xs text-muted">{r.catName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-muted">알림은 브라우저 푸시 알림으로 전송돼요</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[520px] pixel-card p-4">
            <div className="flex items-center justify-between">
              <div className="font-main text-[11px]">설정</div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <section className="pixel-border bg-surface p-3">
                <div className="font-main text-[10px] text-muted">테마 설정</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { key: 'standard', label: 'STANDARD', badge: 'FREE', onClick: () => setAndApplyTheme('standard') },
                    { key: 'pixel', label: 'PIXEL', badge: '🔒 PREMIUM', onClick: () => setSettingsMsg('프리미엄 전용이에요 ✨') },
                    { key: 'nook', label: 'NOOK', badge: '🔒 PREMIUM', onClick: () => setSettingsMsg('프리미엄 전용이에요 ✨') },
                    { key: 'dreamy', label: 'DREAMY', badge: '🔒 PREMIUM', onClick: () => setSettingsMsg('프리미엄 전용이에요 ✨') }
                  ].map((t) => {
                    const active = theme === t.key
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={t.onClick}
                        className={[
                          'pixel-btn px-3 py-3 text-[10px] font-main flex items-center justify-between gap-2',
                          active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                        ].join(' ')}
                      >
                        <span>
                          {t.label} {active ? '✓' : ''}
                        </span>
                        <span style={{ fontSize: 9 }}>{t.badge}</span>
                      </button>
                    )
                  })}
                </div>
                {settingsMsg ? <div className="mt-2 text-xs text-muted">{settingsMsg}</div> : null}
              </section>

              <section className="pixel-border bg-surface p-3">
                <div className="font-main text-[10px] text-muted">언어</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['KR', 'EN'].map((x) => (
                    <button
                      key={x}
                      type="button"
                      onClick={() => setLang(x)}
                      className={[
                        'pixel-btn px-3 py-3 text-[10px] font-main',
                        lang === x ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                      ].join(' ')}
                    >
                      {x}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted">언어 전환은 준비중이에요 🐾</div>
              </section>

              <section className="pixel-border bg-surface p-3">
                <div className="font-main text-[10px] text-muted">데이터</div>
                {!resetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setResetConfirm(true)}
                    className="mt-2 pixel-btn w-full py-3 font-main text-[11px] border-pink bg-card text-pink"
                  >
                    전체 데이터 초기화
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="text-sm">정말 초기화할까요? 모든 기록이 삭제돼요</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={clearAllData}
                        className="pixel-btn flex-1 py-3 font-main text-[11px] border-pink bg-card text-pink"
                      >
                        확인
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetConfirm(false)}
                        className="pixel-btn flex-1 py-3 font-main text-[11px] border-border bg-surface text-muted"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[390px] px-5 pb-28 pt-[72px]">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/my" element={<MyPage theme={theme} onThemeChange={setAndApplyTheme} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--card) 85%, transparent)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="mx-auto flex w-full max-w-[390px] justify-around px-2 pb-5 pt-2">
          {tabs.map((t) => {
            const active = t.key === activeKey
            const color = active ? 'var(--accent)' : 'var(--muted)'
            const Icon =
              t.key === 'home'
                ? NavIconHome
                : t.key === 'calendar'
                  ? NavIconCalendar
                  : t.key === 'routines'
                    ? NavIconClock
                    : t.key === 'diary'
                      ? NavIconBook
                      : NavIconPaw
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => navigate(t.path)}
                className="w-full max-w-[72px] py-1 flex flex-col items-center justify-center gap-[3px]"
                data-active={active ? 'true' : 'false'}
                aria-current={active ? 'page' : undefined}
                aria-label={t.label}
              >
                <span style={{ color }} aria-hidden="true">
                  <Icon active={active} />
                </span>
                <span className="font-body text-[11px] leading-none" style={{ color, fontWeight: active ? 700 : 500 }}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
