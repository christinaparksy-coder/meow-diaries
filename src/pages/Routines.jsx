import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function PixelCatAvatar({ cat, size = 32 }) {
  const variant =
    cat?.avatarVariant ||
    (cat?.id === 'noel' ? 'white_graycrown' : cat?.id === 'liam' ? 'tuxedo' : 'tuxedo')
  const eye = cat?.eyeColor || (variant === 'white_graycrown' ? '#5bc0eb' : '#4db86a')

  if (variant === 'tuxedo') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden="true"
      >
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
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden="true"
      >
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
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
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
    </svg>
  )
}

function PencilIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

const categories = [
  { value: '식사', label: '식사🍚', emoji: '🍚' },
  { value: '약', label: '약💊', emoji: '💊' },
  { value: '놀이', label: '놀이🎾', emoji: '🎾' },
  { value: '미용', label: '미용🪮', emoji: '🪮' },
  { value: '체중', label: '체중⚖️', emoji: '⚖️' },
  { value: '기타', label: '기타✏️', emoji: '✏️' }
]

const weekDays = [
  { key: '월', label: '월' },
  { key: '화', label: '화' },
  { key: '수', label: '수' },
  { key: '목', label: '목' },
  { key: '금', label: '금' },
  { key: '토', label: '토' },
  { key: '일', label: '일' }
]

function normalizeRepeat(r) {
  if (r === 'weekly') return '매주'
  if (r === '매일' || r === '특정 요일' || r === '매주') return r
  return '매일'
}

function repeatSummary(r) {
  const rep = normalizeRepeat(r.repeat)
  if (rep !== '특정 요일') return rep
  const days = Array.isArray(r.days) ? r.days : []
  return days.length ? `특정 요일 · ${days.join(' ')}` : '특정 요일'
}

export default function Routines() {
  const navigate = useNavigate()
  const [cats, setCats] = useState(() => loadJSON('meowdiaries_cats', []))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [catScope, setCatScope] = useState(() => cats[0]?.id || '')
  const [catLocked, setCatLocked] = useState(false)
  const [time, setTime] = useState('08:00')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('식사')
  const [repeat, setRepeat] = useState('매일')
  const [days, setDays] = useState([])
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  useEffect(() => {
    function reload() {
      setCats(loadJSON('meowdiaries_cats', []))
    }
    window.addEventListener('meowdiaries_data_changed', reload)
    return () => window.removeEventListener('meowdiaries_data_changed', reload)
  }, [])

  function persist(nextCats) {
    saveJSON('meowdiaries_cats', nextCats)
    setCats(nextCats)
    window.dispatchEvent(new Event('meowdiaries_data_changed'))
    window.dispatchEvent(new Event('meowdiaries_updated'))
  }

  function openUpgradePrompt() {
    setUpgradeOpen(true)
  }

  function openAddForCat(catId) {
    const cat = cats.find((c) => String(c.id) === String(catId))
    if (!cat) return
    const totalRoutines = (cat.routines || []).length
    if (totalRoutines >= 6) {
      openUpgradePrompt()
      return
    }

    setEditingId(null)
    setCatScope(cat.id)
    setCatLocked(true)
    setTime('08:00')
    setName('')
    setCategory('식사')
    setRepeat('매일')
    setDays([])
    setNote('')
    setFormError('')
    setDeleteConfirm(false)
    setModalOpen(true)
  }

  function openEdit(routineId) {
    const owners = []
    let base = null
    for (const c of cats) {
      const found = (c.routines || []).find((r) => r.id === routineId)
      if (found) {
        owners.push(c.id)
        if (!base) base = found
      }
    }
    if (!base) return

    const scope = owners.length >= 2 ? 'both' : owners[0] || cats[0]?.id || ''
    const catOpt = categories.find((x) => x.emoji === base.emoji)
    setEditingId(routineId)
    setCatScope(scope)
    setCatLocked(false)
    setTime(base.time || '08:00')
    setName(base.name || '')
    setCategory(base.category || catOpt?.value || '기타')
    setRepeat(normalizeRepeat(base.repeat))
    setDays(Array.isArray(base.days) ? base.days : [])
    setNote(base.note || base.sub || '')
    setFormError('')
    setDeleteConfirm(false)
    setModalOpen(true)
  }

  function toggleDay(d) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  function buildRoutine(id) {
    const c = categories.find((x) => x.value === category) || categories[categories.length - 1]
    const rep = normalizeRepeat(repeat)
    const n = note.trim()
    return {
      id,
      time,
      name: name.trim(),
      category: c.value,
      emoji: c.emoji,
      repeat: rep,
      days: rep === '특정 요일' ? days : [],
      repeatDays: rep === '특정 요일' ? days : [],
      note: n,
      sub: n || ''
    }
  }

  function saveRoutine() {
    const n = name.trim()
    if (!n) {
      setFormError('루틴 이름을 입력해줘요 🐾')
      return
    }
    if (!time) {
      setFormError('시간을 선택해줘요 🐾')
      return
    }

    const id = editingId ? editingId : `r_${String(Date.now())}`
    const routine = buildRoutine(id)

    const targetCatIds = catScope === 'both' ? cats.slice(0, 2).map((c) => c.id) : [catScope]

    for (const targetId of targetCatIds) {
      const cat = cats.find((c) => c.id === targetId)
      if (!cat) continue
      const before = (cat.routines || []).length
      const had = Boolean((cat.routines || []).some((r) => r.id === id))
      const after = editingId ? (had ? before : before + 1) : before + 1
      if (after > 6) {
        setModalOpen(false)
        openUpgradePrompt()
        return
      }
    }

    const nextCats = cats.map((c) => ({ ...c, routines: (c.routines || []).filter((r) => r.id !== id) }))

    function addTo(catId) {
      const idx = nextCats.findIndex((c) => c.id === catId)
      if (idx === -1) return
      const list = [...(nextCats[idx].routines || []), routine].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
      nextCats[idx] = { ...nextCats[idx], routines: list }
    }

    if (catScope === 'both') targetCatIds.forEach((id) => addTo(id))
    else addTo(catScope)

    persist(nextCats)
    setModalOpen(false)
  }

  function deleteRoutine() {
    if (!editingId) return
    const id = editingId
    const nextCats = cats.map((c) => ({
      ...c,
      routines: (c.routines || []).filter((r) => r.id !== id)
    }))
    const nextLogs = loadJSON('meowdiaries_routine_logs', []).filter((l) => String(l.routineId) !== String(id))
    saveJSON('meowdiaries_routine_logs', nextLogs)
    persist(nextCats)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      {cats.length === 0 ? (
        <div className="pixel-card p-6 text-sm text-text/90">먼저 고양이를 추가해주세요 🐾</div>
      ) : (
        <>
          <div className="space-y-3">
            {cats.map((c) => (
              <section key={c.id} className="pixel-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 pixel-border bg-surface flex items-center justify-center">
                      <PixelCatAvatar cat={c} size={32} />
                    </div>
                    <div className="font-main text-[11px]">{c.name}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {(c.routines || []).map((r) => (
                    <div key={r.id} className="pixel-border bg-surface p-3 flex items-center gap-3">
                      <div className="text-lg">{r.emoji}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">{r.name}</div>
                        <div className="text-xs text-muted">
                          {r.time} · {repeatSummary(r)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit(r.id)}
                        className="pixel-btn px-2 py-2 text-[10px] font-main border-border bg-surface text-muted"
                        aria-label="루틴 수정"
                      >
                        <PencilIcon />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openAddForCat(c.id)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1.5px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    color: 'var(--accent)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 12
                  }}
                >
                  + 루틴 추가
                </button>
              </section>
            ))}
          </div>
        </>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
          <div className="w-full max-w-[520px] pixel-card p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="font-main text-[11px]">{editingId ? '루틴 수정' : '루틴 추가'}</div>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false)
                  setCatLocked(false)
                }}
                className="pixel-btn px-2 py-2 text-[10px] font-main border-border bg-surface text-muted"
              >
                닫기
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {catLocked && !editingId ? (
                <div>
                  <div className="font-main text-[10px] text-muted">고양이</div>
                  <div className="mt-2 pixel-border bg-surface p-3 flex items-center gap-3">
                    <div className="h-8 w-8 pixel-border bg-surface flex items-center justify-center">
                      <PixelCatAvatar cat={cats.find((x) => String(x.id) === String(catScope))} size={32} />
                    </div>
                    <div className="text-sm">{cats.find((x) => String(x.id) === String(catScope))?.name || ''}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-main text-[10px] text-muted">고양이 선택</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      ...cats.slice(0, 2).map((c) => ({ key: c.id, label: c.name, ids: [c.id] })),
                      ...(cats.length >= 2 ? [{ key: 'both', label: '둘 다', ids: cats.slice(0, 2).map((c) => c.id) }] : [])
                    ].map((opt) => {
                      const active = catScope === opt.key
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setCatScope(opt.key)}
                          className={[
                            'pixel-btn px-2 py-2 text-[10px] font-main flex items-center justify-center gap-2',
                            active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                          ].join(' ')}
                        >
                          <span className="flex items-center">
                            {opt.ids.map((id) => {
                              const c = cats.find((x) => x.id === id)
                              return (
                                <span
                                  key={id}
                                  className="h-8 w-8 pixel-border bg-surface flex items-center justify-center -ml-1 first:ml-0"
                                >
                                  <PixelCatAvatar cat={c} size={32} />
                                </span>
                              )
                            })}
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <div className="font-main text-[10px] text-muted">시간</div>
                  <input type="time" className="meow-field px-3 py-2 text-sm" value={time} onChange={(e) => setTime(e.target.value)} />
                </label>
                <label className="space-y-1">
                  <div className="font-main text-[10px] text-muted">카테고리</div>
                  <select
                    className="meow-field px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-1">
                <div className="font-main text-[10px] text-muted">루틴 이름</div>
                <input
                  type="text"
                  className="meow-field px-3 py-2 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 아침밥, 약, 브러싱"
                />
              </label>

              <div>
                <div className="font-main text-[10px] text-muted">반복 주기</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {['매일', '특정 요일', '매주'].map((r) => {
                    const active = repeat === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRepeat(r)
                          if (r !== '특정 요일') setDays([])
                        }}
                        className={[
                          'pixel-btn px-2 py-2 text-[10px] font-main',
                          active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                        ].join(' ')}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>

                {repeat === '특정 요일' ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {weekDays.map((d) => {
                      const active = days.includes(d.key)
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDay(d.key)}
                          className={[
                            'pixel-btn px-2 py-2 text-[10px] font-main',
                            active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                          ].join(' ')}
                        >
                          {d.label}
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>

              <label className="space-y-1">
                <div className="font-main text-[10px] text-muted">메모/설명</div>
                <input type="text" className="meow-field px-3 py-2 text-sm" value={note} onChange={(e) => setNote(e.target.value)} />
              </label>

              {formError ? <div className="text-xs text-pink">{formError}</div> : null}

              <div className="mt-2 flex gap-2">
                <button type="button" onClick={saveRoutine} className="pixel-btn flex-1 py-3 font-main text-[11px] border-accent bg-card">
                  루틴 저장하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    setCatLocked(false)
                  }}
                  className="pixel-btn px-4 py-3 font-main text-[11px] border-border bg-surface text-muted"
                >
                  취소
                </button>
              </div>

              {editingId ? (
                <div className="mt-3">
                  {!deleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="pixel-btn w-full py-3 font-main text-[11px] border-pink bg-surface text-pink"
                    >
                      루틴 삭제
                    </button>
                  ) : (
                    <div className="pixel-border bg-surface p-3">
                      <div className="text-sm">정말 삭제할까요?</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={deleteRoutine}
                          className="pixel-btn flex-1 py-2 font-main text-[11px] border-pink bg-card text-pink"
                        >
                          확인
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="pixel-btn flex-1 py-2 font-main text-[11px] border-border bg-surface text-muted"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {upgradeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[520px] pixel-card p-5 bg-card">
            <div className="font-main text-[13px]">루틴을 더 추가하려면 프리미엄이 필요해요 🐾</div>
            <div className="mt-2 text-sm text-text/85">
              무료 플랜에서는 고양이 한 마리당 루틴을 최대 6개까지 만들 수 있어요. 더 많은 루틴을 관리하고 싶다면 프리미엄으로
              업그레이드해보세요.
            </div>
            <div className="mt-4 space-y-2 text-sm text-text/85">
              <div>✓ 루틴 무제한</div>
              <div>✓ 고양이 무제한 추가</div>
              <div>✓ AI 음성 알림</div>
              <div>✓ 테마팩 전체</div>
              <div>✓ 사진 무제한 저장</div>
            </div>
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setUpgradeOpen(false)
                  navigate('/my')
                }}
                style={{
                  width: '100%',
                  padding: 14,
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: 'var(--btn-radius)',
                  fontWeight: 700,
                  border: 'none'
                }}
              >
                프리미엄 시작하기 ✨ ₩3,900/월
              </button>
              <button
                type="button"
                onClick={() => setUpgradeOpen(false)}
                className="pixel-btn w-full py-3 font-main text-[11px] border-border bg-surface text-muted"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

