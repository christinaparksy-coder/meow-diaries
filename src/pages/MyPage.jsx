import { useMemo, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import CatFormModal from '../components/CatFormModal.jsx'
import AddCatFlow from '../components/AddCatFlow.jsx'

function safeParseObj(raw) {
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function localISODate(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function diffDays(aStr, bStr) {
  const a = new Date(`${aStr}T00:00:00`)
  const b = new Date(`${bStr}T00:00:00`)
  const ms = b.getTime() - a.getTime()
  return Math.floor(ms / 86400000)
}

function isValidOwnerInput(value) {
  const s = String(value || '').trim()
  if (s.length < 2 || s.length > 10) return false
  return /^[A-Za-z0-9가-힣 ]+$/.test(s)
}

function clampStatus(value) {
  return String(value || '').slice(0, 50)
}

function dispatchChanged() {
  window.dispatchEvent(new Event('meowdiaries_data_changed'))
}

function subscribe(cb) {
  window.addEventListener('meowdiaries_data_changed', cb)
  window.addEventListener('meowdiaries_updated', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('meowdiaries_data_changed', cb)
    window.removeEventListener('meowdiaries_updated', cb)
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

function TinyCat({ cat }) {
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'
  if (cat?.photoUrl) {
    return (
      <div className="h-[52px] w-[52px] flex items-center justify-center overflow-hidden" style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)' }}>
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
  return (
    <div className="h-[52px] w-[52px] flex items-center justify-center" style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="h-7 w-7" style={{ background: base, position: 'relative', borderRadius: 4 }}>
        {variant === 'white_graycrown' ? (
          <>
            <div style={{ position: 'absolute', left: '16%', top: '-4%', width: '68%', height: '28%', background: '#bebebe' }} />
            <div style={{ position: 'absolute', left: '22%', top: '6%', width: '56%', height: '20%', background: '#cecece' }} />
          </>
        ) : null}
        {variant === 'calico' ? (
          <>
            <div style={{ position: 'absolute', left: '0%', top: '0%', width: '45%', height: '40%', background: '#d58b3c', opacity: 0.9 }} />
            <div style={{ position: 'absolute', right: '0%', bottom: '0%', width: '35%', height: '35%', background: '#222', opacity: 0.9 }} />
          </>
        ) : null}
        <div style={{ position: 'absolute', left: '22%', top: '32%', width: 4, height: 4, background: eye }} />
        <div style={{ position: 'absolute', right: '22%', top: '32%', width: 4, height: 4, background: eye }} />
      </div>
    </div>
  )
}

export default function MyPage({ theme, onThemeChange }) {
  const navigate = useNavigate()
  const catsRaw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('meowdiaries_cats') || '[]',
    () => localStorage.getItem('meowdiaries_cats') || '[]'
  )
  const cats = useMemo(() => safeParse(catsRaw), [catsRaw])

  const ownerRaw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('meowdiaries_owner_profile') || 'null',
    () => localStorage.getItem('meowdiaries_owner_profile') || 'null'
  )
  const owner = useMemo(() => safeParseObj(ownerRaw), [ownerRaw])

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [addFlowOpen, setAddFlowOpen] = useState(false)
  const [ownerEditOpen, setOwnerEditOpen] = useState(false)
  const [ownerDraft, setOwnerDraft] = useState({ name: '', mindset: '', status: '' })
  const [ownerDraftError, setOwnerDraftError] = useState('')
  const [limitOpen, setLimitOpen] = useState(false)
  const [limitText, setLimitText] = useState('')

  const isFree = true
  const maxCats = 2
  const canAdd = !isFree || cats.length < maxCats

  function openAdd() {
    if (!canAdd) {
      return
    }
    setAddFlowOpen(true)
  }

  function openEdit(cat) {
    setEditingCat(cat)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingCat(null)
  }

  function saveCat(cat) {
    const next = cats.slice()
    const idx = next.findIndex((c) => String(c.id) === String(cat.id))
    if (idx >= 0) next[idx] = { ...next[idx], ...cat }
    else next.push(cat)
    localStorage.setItem('meowdiaries_cats', JSON.stringify(next))
    dispatchChanged()
    closeModal()
  }

  function deleteCat(catId) {
    const id = String(catId)
    const nextCats = cats.filter((c) => String(c.id) !== id)
    localStorage.setItem('meowdiaries_cats', JSON.stringify(nextCats))

    const logs = safeParse(localStorage.getItem('meowdiaries_routine_logs') || '[]').filter((l) => String(l.catId) !== id)
    localStorage.setItem('meowdiaries_routine_logs', JSON.stringify(logs))

    const entries = safeParse(localStorage.getItem('meowdiaries_diary_entries') || '[]').filter((e) => String(e.catId) !== id)
    localStorage.setItem('meowdiaries_diary_entries', JSON.stringify(entries))

    dispatchChanged()
    closeModal()
  }

  function chooseNook() {
    alert('프리미엄 전용이에요 ✨')
  }

  const ownerName = String(owner?.name || '').trim()
  const ownerMindset = String(owner?.mindset || '').trim()
  const ownerStatus = String(owner?.status || '').trim()

  const profileSubtitle = ownerStatus ? ownerStatus : '매일의 소중한 순간을 기록해요 🐾'

  function openOwnerEdit() {
    const last = owner?.lastUpdatedDate ? String(owner.lastUpdatedDate) : null
    const today = localISODate()
    if (last) {
      const passed = diffDays(last, today)
      if (passed < 7) {
        const left = 7 - passed
        setLimitText(`아직 수정할 수 없어요.\n${left}일 뒤에 다시 바꿀 수 있어요 🐾`)
        setLimitOpen(true)
        return
      }
    }

    setOwnerDraftError('')
    setOwnerDraft({
      name: ownerName,
      mindset: ownerMindset,
      status: ownerStatus
    })
    setOwnerEditOpen(true)
  }

  const ownerCanSave = useMemo(() => {
    const nOk = isValidOwnerInput(ownerDraft.name)
    const mOk = isValidOwnerInput(ownerDraft.mindset)
    const sOk = String(ownerDraft.status || '').length <= 50
    return nOk && mOk && sOk
  }, [ownerDraft])

  function saveOwner() {
    const today = localISODate()
    const last = owner?.lastUpdatedDate ? String(owner.lastUpdatedDate) : null
    if (last) {
      const passed = diffDays(last, today)
      if (passed < 7) {
        const left = 7 - passed
        setLimitText(`아직 수정할 수 없어요.\n${left}일 뒤에 다시 바꿀 수 있어요 🐾`)
        setLimitOpen(true)
        setOwnerEditOpen(false)
        return
      }
    }

    const name = String(ownerDraft.name || '').trim()
    const mindset = String(ownerDraft.mindset || '').trim()
    const status = clampStatus(ownerDraft.status || '')
    if (!isValidOwnerInput(name)) {
      setOwnerDraftError('집사님 이름은 2~10자, 한글/영문/숫자만 가능해요')
      return
    }
    if (!isValidOwnerInput(mindset)) {
      setOwnerDraftError('마음가짐은 2~10자, 한글/영문/숫자만 가능해요')
      return
    }
    if (status.length > 50) {
      setOwnerDraftError('상태 메시지는 50자까지 가능해요')
      return
    }

    try {
      localStorage.setItem(
        'meowdiaries_owner_profile',
        JSON.stringify({
          name,
          mindset,
          status,
          updatedAt: Date.now(),
          lastUpdatedDate: today
        })
      )
    } catch {}
    dispatchChanged()
    setOwnerEditOpen(false)
  }

  return (
    <div className="space-y-6">
      <section
        style={{
          marginTop: 8,
          borderRadius: 24,
          padding: 22,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: 'var(--accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                fontSize: 22,
                flexShrink: 0
              }}
              aria-hidden="true"
            >
              🐾
            </div>
            <div className="min-w-0">
              <div className="text-[18px] font-bold text-text">마이</div>
              {ownerName ? (
                <div className="mt-1">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'rgba(255,241,234,0.75)',
                      color: 'var(--text)',
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    집사 {ownerName}
                  </span>
                </div>
              ) : null}
              <div className="mt-2 text-[13px]" style={{ color: 'var(--muted)' }}>
                {profileSubtitle}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openOwnerEdit}
            aria-label="집사 정보 수정"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 16,
              border: '1px solid rgba(60,40,20,0.08)',
              background: 'rgba(255,255,255,0.55)',
              color: 'var(--muted)',
              fontSize: 18
            }}
          >
            ✎
          </button>
        </div>

        <div
          className="mt-4 flex items-center justify-between"
          style={{
            paddingTop: 14,
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text)' }}>
            <span aria-hidden="true">🌐</span>
            <span>언어 설정</span>
          </div>
          <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
            KR / EN
          </div>
        </div>
      </section>

      <section
        style={{
          marginTop: 24,
          borderRadius: 24,
          padding: 22,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-bold text-text">🐾 우리 고양이</div>
            </div>
            <div className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
              사랑하는 아이들을 관리해요
            </div>
          </div>
          <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
            {cats.length}/{maxCats} 마리
          </div>
        </div>

        <div className="mt-4">
          {cats.length === 0 ? (
            <div className="text-[14px]" style={{ color: 'var(--muted)', padding: '16px 6px' }}>
              아직 고양이가 없어요. 먼저 추가해볼까요? 🐾
            </div>
          ) : (
            <div>
              {cats.map((c, idx) => {
                const tags = [c.descriptionTag, c.personalityTag].filter((x) => String(x || '').trim() !== '')
                const sub = tags.length ? tags.join(' · ') : '어떤 아이인지 아직 안 적었어요'
                return (
                  <div
                    key={c.id}
                    style={{
                      height: 72,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 6px',
                      borderBottom: idx === cats.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <TinyCat cat={c} />
                      <div className="min-w-0">
                        <div className="text-[18px] font-bold text-text truncate">{c.name}</div>
                        <div
                          className="mt-1 inline-flex max-w-full truncate"
                          style={{
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'rgba(255,241,234,0.7)',
                            color: 'var(--muted)',
                            fontSize: 12
                          }}
                        >
                          <span className="truncate">{sub}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        border: '1px solid rgba(60,40,20,0.10)',
                        background: 'rgba(255,255,255,0.6)',
                        color: 'var(--text)',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      편집
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openAdd}
          disabled={!canAdd}
          aria-disabled={!canAdd}
          style={{
            marginTop: 16,
            width: '100%',
            height: 64,
            borderRadius: 18,
            border: '2px dashed rgba(255,138,91,0.35)',
            background: 'rgba(255,255,255,0.45)',
            color: 'var(--accent)',
            fontSize: 15,
            fontWeight: 700,
            opacity: canAdd ? 1 : 0.6,
            cursor: canAdd ? 'pointer' : 'not-allowed',
            boxShadow: canAdd ? '0 6px 16px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          🐱 새로운 친구 추가하기
        </button>

        {!canAdd ? (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 18,
              border: '1px solid rgba(60,40,20,0.08)',
              background: 'rgba(255,241,234,0.55)'
            }}
          >
            <div className="text-[13px]" style={{ color: 'var(--text)', lineHeight: 1.5 }}>
              🌱 무료 플랜은 2마리까지 등록 가능해요
              <br />
              프리미엄으로 무제한 등록하고 더 많은 기능을 만나보세요!
            </div>
            <button
              type="button"
              onClick={chooseNook}
              style={{
                marginTop: 10,
                width: '100%',
                padding: '12px 14px',
                borderRadius: 16,
                border: '1px solid rgba(255,138,91,0.25)',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                fontWeight: 800,
                fontSize: 13
              }}
            >
              프리미엄 시작하기 ✨
            </button>
          </div>
        ) : null}
      </section>

      <section
        style={{
          marginTop: 24,
          borderRadius: 24,
          padding: 22,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-text">🎨 테마</div>
          <div className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
            나만의 분위기로 야옹일기를 꾸며보세요
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            {
              key: 'standard',
              title: 'STANDARD',
              sub: '따뜻하고 조용한 기본 테마',
              badge: 'FREE',
              locked: false,
              preview: { a: '#fffdfa', b: '#f7f2eb', c: '#ff8a5b' }
            },
            { key: 'pixel', title: 'PIXEL', sub: '레트로 게임 감성', badge: '🔒 PREMIUM', locked: true, preview: { a: '#1f2937', b: '#111827', c: '#22c55e' } },
            { key: 'nook', title: 'NOOK', sub: '동물의 숲 감성', badge: '🔒 PREMIUM', locked: true, preview: { a: '#fbf7ef', b: '#e8f1e5', c: '#4caf82' } },
            { key: 'dreamy', title: 'DREAMY', sub: '몽글몽글 파스텔', badge: '🔒 PREMIUM', locked: true, preview: { a: '#fff7fd', b: '#f1f5ff', c: '#b58cff' } }
          ].map((t) => {
            const selected = theme === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => (t.locked ? chooseNook() : onThemeChange?.(t.key))}
                style={{
                  textAlign: 'left',
                  borderRadius: 20,
                  border: selected ? '1px solid rgba(255,138,91,0.55)' : '1px solid rgba(60,40,20,0.08)',
                  background: 'rgba(255,255,255,0.55)',
                  padding: 14,
                  boxShadow: selected ? '0 6px 18px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <div style={{ height: 54, borderRadius: 16, background: t.preview.b, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', display: 'flex' }}>
                    <div style={{ flex: 1, background: t.preview.a }} />
                    <div style={{ width: 60, background: t.preview.c, opacity: 0.22 }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="text-[13px] font-bold text-text">{t.title}</div>
                  <div style={{ fontSize: 10, color: t.locked ? 'var(--muted)' : 'var(--accent)', fontWeight: 700 }}>{t.badge}</div>
                </div>
                <div className="mt-1 text-[12px]" style={{ color: 'var(--muted)', lineHeight: 1.3 }}>
                  {t.sub}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section
        style={{
          marginTop: 24,
          borderRadius: 24,
          padding: 22,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-text">⚙ 설정</div>
          <div className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
            앱 관련 설정을 관리해요
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: '알림 설정', icon: '🔔', onClick: () => alert('오른쪽 위 🔔에서 설정할 수 있어요 🐾') },
            { label: '개인정보', icon: '🔒', onClick: () => alert('준비중이에요 🐾') },
            { label: '데이터 관리', icon: '🗂️', onClick: () => alert('오른쪽 위 ⚙에서 관리할 수 있어요 🐾') },
            { label: '도움말', icon: '❓', onClick: () => alert('준비중이에요 🐾') }
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={b.onClick}
              style={{
                height: 72,
                borderRadius: 18,
                border: '1px solid rgba(60,40,20,0.08)',
                background: 'rgba(255,255,255,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
                color: 'var(--text)'
              }}
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true">{b.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{b.label}</span>
              </div>
              <span aria-hidden="true" style={{ color: 'var(--muted)' }}>
                ›
              </span>
            </button>
          ))}
        </div>
      </section>

      <CatFormModal
        open={modalOpen}
        mode="edit"
        initialCat={editingCat}
        onCancel={closeModal}
        onSave={saveCat}
        onDelete={deleteCat}
      />

      <AddCatFlow open={addFlowOpen} onClose={() => setAddFlowOpen(false)} />

      {ownerEditOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-[520px]"
            style={{
              borderRadius: 24,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-elevated)',
              padding: 18
            }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-bold text-text">집사 정보 수정</div>
              <button
                type="button"
                onClick={() => setOwnerEditOpen(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  border: '1px solid rgba(60,40,20,0.08)',
                  background: 'rgba(255,255,255,0.55)',
                  color: 'var(--muted)'
                }}
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="space-y-1 block">
                <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
                  집사님의 이름 (2~10자, 한글/영문/숫자)
                </div>
                <input
                  type="text"
                  className="meow-field px-3 py-3 text-[15px]"
                  value={ownerDraft.name}
                  onChange={(e) => {
                    setOwnerDraftError('')
                    setOwnerDraft((p) => ({ ...p, name: e.target.value }))
                  }}
                />
              </label>

              <label className="space-y-1 block">
                <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
                  집사님의 마음가짐 (2~10자, 한글/영문/숫자)
                </div>
                <input
                  type="text"
                  className="meow-field px-3 py-3 text-[15px]"
                  value={ownerDraft.mindset}
                  onChange={(e) => {
                    setOwnerDraftError('')
                    setOwnerDraft((p) => ({ ...p, mindset: e.target.value }))
                  }}
                />
              </label>

              <label className="space-y-1 block">
                <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
                  집사 상태 메시지 (최대 50자)
                </div>
                <input
                  type="text"
                  className="meow-field px-3 py-3 text-[15px]"
                  value={ownerDraft.status}
                  onChange={(e) => {
                    const next = clampStatus(e.target.value)
                    setOwnerDraftError('')
                    setOwnerDraft((p) => ({ ...p, status: next }))
                  }}
                />
                <div className="text-right text-[11px]" style={{ color: 'var(--muted)' }}>
                  {String(ownerDraft.status || '').length}/50
                </div>
              </label>

              {ownerDraftError ? (
                <div className="text-[12px]" style={{ color: 'var(--accent)' }}>
                  {ownerDraftError}
                </div>
              ) : null}

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={saveOwner}
                  disabled={!ownerCanSave}
                  aria-disabled={!ownerCanSave}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 16,
                    border: '1px solid rgba(255,138,91,0.25)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 13,
                    opacity: ownerCanSave ? 1 : 0.6
                  }}
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setOwnerEditOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 16,
                    border: '1px solid rgba(60,40,20,0.10)',
                    background: 'rgba(255,255,255,0.55)',
                    color: 'var(--text)',
                    fontWeight: 700,
                    fontSize: 13
                  }}
                >
                  취소
                </button>
              </div>
              <div className="mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
                집사 정보는 7일에 1번만 수정할 수 있어요
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {limitOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 22,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-elevated)',
              padding: 18
            }}
          >
            <div className="text-[15px] font-bold text-text">잠깐만요 🐾</div>
            <div className="mt-2 text-[13px]" style={{ color: 'var(--muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {limitText}
            </div>
            <button
              type="button"
              onClick={() => setLimitOpen(false)}
              style={{
                marginTop: 14,
                width: '100%',
                padding: '12px 14px',
                borderRadius: 16,
                border: '1px solid rgba(60,40,20,0.10)',
                background: 'rgba(255,255,255,0.55)',
                color: 'var(--text)',
                fontWeight: 800,
                fontSize: 13
              }}
            >
              확인
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

