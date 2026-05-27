import { useEffect, useMemo, useState } from 'react'

const avatarOptions = [
  { value: 'tuxedo', label: '턱시도' },
  { value: 'white_graycrown', label: '흰둥이' },
  { value: 'orange_tabby', label: '주황 태비' },
  { value: 'gray_tabby', label: '회색 태비' },
  { value: 'calico', label: '칼리코' },
  { value: 'black', label: '올블랙' }
]

const eyePresets = [
  { label: '초록', value: '#4db86a' },
  { label: '파랑', value: '#5bc0eb' },
  { label: '노랑', value: '#f2d060' },
  { label: '주황', value: '#e8a87c' },
  { label: '갈색', value: '#8b5e3c' }
]

function CatSprite({ variant, eyeColor }) {
  const eye = eyeColor || '#4db86a'
  if (variant === 'tuxedo') {
    return (
      <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
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
      <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
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
    <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
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

export default function CatFormModal({ open, mode, initialCat, onCancel, onSave, onDelete }) {
  const isEdit = mode === 'edit'

  const baseCat = useMemo(() => {
    return (
      initialCat || {
        id: '',
        name: '',
        breed: '',
        birthdate: '',
        weight: null,
        avatarVariant: 'tuxedo',
        eyeColor: '#4db86a',
        personalityTag: '',
        statusPixel: '',
        statusNook: '',
        routines: []
      }
    )
  }, [initialCat])

  const [name, setName] = useState(baseCat.name || '')
  const [breed, setBreed] = useState(baseCat.breed || '')
  const [birthdate, setBirthdate] = useState(baseCat.birthdate || '')
  const [weight, setWeight] = useState(baseCat.weight ?? '')
  const [avatarVariant, setAvatarVariant] = useState(baseCat.avatarVariant || 'tuxedo')
  const [eyeColor, setEyeColor] = useState(baseCat.eyeColor || '#4db86a')
  const [personalityTag, setPersonalityTag] = useState(baseCat.personalityTag || '')
  const [statusPixel, setStatusPixel] = useState(baseCat.statusPixel || '')
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(baseCat.name || '')
    setBreed(baseCat.breed || '')
    setBirthdate(baseCat.birthdate || '')
    setWeight(baseCat.weight ?? '')
    setAvatarVariant(baseCat.avatarVariant || 'tuxedo')
    setEyeColor(baseCat.eyeColor || '#4db86a')
    setPersonalityTag(baseCat.personalityTag || '')
    setStatusPixel(baseCat.statusPixel || '')
    setError('')
    setDeleteConfirm(false)
  }, [open, baseCat])

  if (!open) return null

  function submit() {
    const n = name.trim()
    if (!n) {
      setError('이름은 꼭 입력해줘요 🐾')
      return
    }
    const w = weight === '' ? null : Number(weight)
    const next = {
      id: isEdit ? String(baseCat.id) : String(Date.now()),
      name: n,
      breed: breed.trim(),
      birthdate: birthdate || '',
      weight: Number.isFinite(w) ? w : null,
      avatarVariant,
      eyeColor,
      personalityTag: personalityTag.trim(),
      statusPixel: statusPixel.trim(),
      statusNook: baseCat.statusNook || statusPixel.trim(),
      routines: Array.isArray(baseCat.routines) ? baseCat.routines : []
    }
    onSave?.(next)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-[520px] pixel-card p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="font-main text-[11px]">{isEdit ? '고양이 수정' : '고양이 추가'}</div>
          <button type="button" onClick={onCancel} className="pixel-btn px-3 py-2 text-[10px] font-main border-border bg-surface text-muted">
            닫기
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="space-y-1">
            <div className="font-main text-[10px] text-muted">이름 *</div>
            <input type="text" className="meow-field px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="space-y-1">
            <div className="font-main text-[10px] text-muted">어떤 아이예요?</div>
            <input
              type="text"
              className="meow-field px-3 py-2 text-sm"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="예: 치즈냥, 사랑둥이, 그냥 귀여움"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <div className="font-main text-[10px] text-muted">생일</div>
              <input type="date" className="meow-field px-3 py-2 text-sm" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </label>
            <label className="space-y-1">
              <div className="font-main text-[10px] text-muted">몸무게 (kg)</div>
              <input
                type="number"
                step="0.1"
                className="meow-field px-3 py-2 text-sm"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 4.2"
              />
            </label>
          </div>

          <div>
            <div className="font-main text-[10px] text-muted">아바타 선택</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {avatarOptions.map((o) => {
                const active = avatarVariant === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setAvatarVariant(o.value)}
                    className={[
                      'pixel-btn px-2 py-2 text-[10px] font-main flex flex-col items-center gap-2',
                      active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                    ].join(' ')}
                    aria-pressed={active}
                  >
                    <span className="h-10 w-10 pixel-border bg-surface flex items-center justify-center">
                      <CatSprite variant={o.value} eyeColor={eyeColor} />
                    </span>
                    <span>{o.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="font-main text-[10px] text-muted">눈 색깔</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {eyePresets.map((p) => {
                const active = eyeColor.toLowerCase() === p.value.toLowerCase()
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setEyeColor(p.value)}
                    className={[
                      'pixel-btn px-2 py-2 text-[10px] font-main flex items-center gap-2',
                      active ? 'border-accent bg-card' : 'border-border bg-surface text-muted'
                    ].join(' ')}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: p.value }} aria-hidden="true" />
                    <span>{p.label}</span>
                  </button>
                )
              })}
              <input type="color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className="h-10 w-12 pixel-border bg-surface" />
            </div>
          </div>

          <label className="space-y-1">
            <div className="font-main text-[10px] text-muted">성격 태그</div>
            <input
              type="text"
              className="meow-field px-3 py-2 text-sm"
              value={personalityTag}
              onChange={(e) => setPersonalityTag(e.target.value)}
              placeholder="예: 창문 구경 전문가"
            />
          </label>

          <label className="space-y-1">
            <div className="font-main text-[10px] text-muted">상태 메시지</div>
            <input
              type="text"
              className="meow-field px-3 py-2 text-sm"
              value={statusPixel}
              onChange={(e) => setStatusPixel(e.target.value)}
              placeholder="예: 지금 낮잠 중… 😴"
            />
          </label>

          {error ? <div className="text-xs text-pink">{error}</div> : null}

          <div className="mt-2 flex gap-2">
            <button type="button" onClick={submit} className="pixel-btn flex-1 py-3 font-main text-[11px] border-accent bg-card">
              {isEdit ? '저장하기' : '고양이 추가하기'}
            </button>
            <button type="button" onClick={onCancel} className="pixel-btn px-4 py-3 font-main text-[11px] border-border bg-surface text-muted">
              취소
            </button>
          </div>

          {isEdit ? (
            <div className="mt-3">
              {!deleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="pixel-btn w-full py-3 font-main text-[11px] border-pink bg-surface text-pink"
                >
                  고양이 작별
                </button>
              ) : (
                <div className="pixel-border bg-surface p-3">
                  <div className="text-sm">정말 작별할까요? 루틴과 기록도 함께 삭제돼요</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onDelete?.(String(baseCat.id))}
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
  )
}
