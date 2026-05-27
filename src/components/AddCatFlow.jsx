import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function downscaleDataUrl(dataUrl, maxSize = 256, quality = 0.82) {
  return new Promise((resolve) => {
    const url = String(dataUrl || '')
    if (!url.startsWith('data:image/')) {
      resolve(url)
      return
    }

    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height
      if (!w || !h) {
        resolve(url)
        return
      }

      const scale = Math.min(1, maxSize / Math.max(w, h))
      const cw = Math.max(1, Math.round(w * scale))
      const ch = Math.max(1, Math.round(h * scale))

      const canvas = document.createElement('canvas')
      canvas.width = cw
      canvas.height = ch
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(url)
        return
      }
      ctx.drawImage(img, 0, 0, cw, ch)

      try {
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch {
        resolve(url)
      }
    }
    img.onerror = () => resolve(url)
    img.src = url
  })
}

function isValidOwnerInput(value) {
  const s = String(value || '').trim()
  if (s.length < 2 || s.length > 10) return false
  return /^[A-Za-z0-9가-힣 ]+$/.test(s)
}

function clampStatus(value) {
  return String(value || '').slice(0, 50)
}

function localISODate(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const avatarTiles = [
  { value: 'tuxedo', label: '턱시도냥', body: '#333', extra: '#eee', eyes: '#4db86a' },
  { value: 'white_graycrown', label: '흰둥이', body: '#f2f2f2', extra: '#b8b8b8', eyes: '#5bc0eb' },
  { value: 'orange_tabby', label: '치즈냥', body: '#e8833a', extra: '#c45e1a', eyes: '#d4a017' },
  { value: 'gray_tabby', label: '고등어태비', body: '#888', extra: '#555', eyes: '#4db86a' },
  { value: 'calico', label: '삼색이', body: '#f2f2f2', extra: '#e8833a', eyes: '#d4a017' },
  { value: 'black', label: '올블랙', body: '#111', extra: '#111', eyes: '#f5c842' }
]

function CatTileSprite({ tile }) {
  const eye = tile.eyes
  if (tile.value === 'tuxedo') {
    return (
      <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
        <rect x="3" y="1" width="2" height="2" fill="#222" />
        <rect x="11" y="1" width="2" height="2" fill="#222" />
        <rect x="4" y="2" width="8" height="7" fill={tile.body} />
        <rect x="3" y="3" width="10" height="6" fill={tile.body} />
        <rect x="5" y="6" width="6" height="3" fill={tile.extra} />
        <rect x="5" y="5" width="2" height="2" fill={eye} />
        <rect x="9" y="5" width="2" height="2" fill={eye} />
        <rect x="6" y="6" width="1" height="1" fill="#111" />
        <rect x="10" y="6" width="1" height="1" fill="#111" />
        <rect x="5" y="5" width="1" height="1" fill="#fff" />
        <rect x="9" y="5" width="1" height="1" fill="#fff" />
        <rect x="5" y="9" width="6" height="5" fill={tile.extra} />
        <rect x="4" y="10" width="2" height="4" fill="#222" />
        <rect x="10" y="10" width="2" height="4" fill="#222" />
      </svg>
    )
  }

  if (tile.value === 'white_graycrown') {
    return (
      <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
        <rect x="1" y="0" width="3" height="3" fill={tile.extra} />
        <rect x="12" y="0" width="3" height="3" fill={tile.extra} />
        <rect x="2" y="2" width="12" height="10" fill={tile.body} />
        <rect x="4" y="2" width="8" height="1" fill="#c8c8c8" />
        <rect x="5" y="3" width="6" height="1" fill="#d6d6d6" />
        <rect x="3" y="5" width="3" height="3" fill={eye} />
        <rect x="10" y="5" width="3" height="3" fill={eye} />
        <rect x="4" y="6" width="2" height="2" fill="#1a1a2e" />
        <rect x="11" y="6" width="2" height="2" fill="#1a1a2e" />
        <rect x="4" y="6" width="1" height="1" fill="#fff" />
        <rect x="11" y="6" width="1" height="1" fill="#fff" />
        <rect x="2" y="10" width="12" height="2" fill="#e0e0e0" />
      </svg>
    )
  }

  if (tile.value === 'calico') {
    return (
      <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
        <rect x="2" y="2" width="12" height="10" fill={tile.body} />
        <rect x="2" y="2" width="5" height="5" fill="#e8833a" opacity="0.9" />
        <rect x="10" y="8" width="4" height="4" fill="#111" opacity="0.9" />
        <rect x="3" y="5" width="3" height="3" fill={eye} />
        <rect x="10" y="5" width="3" height="3" fill={eye} />
        <rect x="4" y="6" width="2" height="2" fill="#111" />
        <rect x="11" y="6" width="2" height="2" fill="#111" />
        <rect x="4" y="6" width="1" height="1" fill="#fff" />
        <rect x="11" y="6" width="1" height="1" fill="#fff" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }} aria-hidden="true">
      <rect x="2" y="2" width="12" height="10" fill={tile.body} />
      {tile.value === 'orange_tabby' || tile.value === 'gray_tabby' ? (
        <>
          <rect x="4" y="8" width="8" height="1" fill={tile.extra} opacity="0.55" />
          <rect x="3" y="10" width="10" height="1" fill={tile.extra} opacity="0.55" />
        </>
      ) : null}
      <rect x="3" y="5" width="3" height="3" fill={eye} />
      <rect x="10" y="5" width="3" height="3" fill={eye} />
      <rect x="4" y="6" width="2" height="2" fill="#111" />
      <rect x="11" y="6" width="2" height="2" fill="#111" />
      <rect x="4" y="6" width="1" height="1" fill="#fff" />
      <rect x="11" y="6" width="1" height="1" fill="#fff" />
    </svg>
  )
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2 text-[12px] rounded-[999px] border"
      style={{
        borderColor: active ? 'var(--accent)' : 'rgba(0,0,0,0.08)',
        background: active ? 'color-mix(in srgb, var(--accent) 12%, #fff)' : 'rgba(255,255,255,0.6)',
        color: active ? 'var(--accent)' : 'var(--text)'
      }}
    >
      {label}
    </button>
  )
}

export default function AddCatFlow({ open, onClose, required = false }) {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const nameInputRef = useRef(null)
  const editInputRef = useRef(null)

  const [step, setStep] = useState(1)
  const [ownerLocked, setOwnerLocked] = useState(false)
  const [ownerError, setOwnerError] = useState('')
  const [catData, setCatData] = useState({
    name: '',
    avatarVariant: 'tuxedo',
    photoUrl: null,
    descriptionTag: '',
    personalityTag: '',
    morningFeedTime: '08:00',
    eveningFeedTime: '20:00',
    hasMed: false,
    medTime: '20:00',
    ownerName: '',
    ownerMindset: '',
    ownerStatus: ''
  })

  useEffect(() => {
    if (!open) return
    setStep(1)
    setOwnerError('')
    let profile = null
    try {
      profile = JSON.parse(localStorage.getItem('meowdiaries_owner_profile') || 'null')
    } catch {
      profile = null
    }
    const hasOwner = profile && typeof profile === 'object' && String(profile.name || '').trim() !== ''
    setOwnerLocked(Boolean(hasOwner))
    setCatData({
      name: '',
      avatarVariant: 'tuxedo',
      photoUrl: null,
      descriptionTag: '',
      personalityTag: '',
      morningFeedTime: '08:00',
      eveningFeedTime: '20:00',
      hasMed: false,
      medTime: '20:00',
      ownerName: hasOwner ? String(profile.name || '') : '',
      ownerMindset: hasOwner ? String(profile.mindset || '') : '',
      ownerStatus: hasOwner ? String(profile.status || '') : ''
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    if (step === 1) {
      nameInputRef.current?.focus?.()
      return
    }
    if (step === 3 || step === 4 || step === 5) {
      editInputRef.current?.focus?.()
    }
  }, [open, step])

  const canNextName = catData.name.trim() !== ''
  const activeTile = useMemo(() => avatarTiles.find((t) => t.value === catData.avatarVariant) || avatarTiles[0], [catData.avatarVariant])

  if (!open) return null

  function close() {
    onClose?.()
  }

  function back() {
    setStep((s) => Math.max(1, s - 1))
  }

  function next() {
    setStep((s) => Math.min(5, s + 1))
  }

  function pickPhoto() {
    fileRef.current?.click?.()
  }

  function onPhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      void (async () => {
        const resized = await downscaleDataUrl(dataUrl)
        setCatData((p) => ({ ...p, photoUrl: resized, avatarVariant: 'photo' }))
      })()
    }
    reader.readAsDataURL(file)
  }

  function selectTile(v) {
    setCatData((p) => ({ ...p, avatarVariant: v, photoUrl: null }))
  }

  function save() {
    const name = catData.name.trim()
    if (!name) return

    if (!ownerLocked) {
      const ownerName = String(catData.ownerName || '').trim()
      const ownerMindset = String(catData.ownerMindset || '').trim()
      const ownerStatus = String(catData.ownerStatus || '')

      if (!isValidOwnerInput(ownerName)) {
        setOwnerError('집사님 이름은 2~10자, 한글/영문/숫자만 가능해요')
        return
      }
      if (!isValidOwnerInput(ownerMindset)) {
        setOwnerError('마음가짐은 2~10자, 한글/영문/숫자만 가능해요')
        return
      }

      try {
        localStorage.setItem(
          'meowdiaries_owner_profile',
          JSON.stringify({
            name: ownerName,
            mindset: ownerMindset,
            status: clampStatus(ownerStatus),
            updatedAt: Date.now(),
            lastUpdatedDate: localISODate()
          })
        )
      } catch {}
    }

    const ts = Date.now()
    const routines = [
      { id: `r_${ts}`, time: catData.morningFeedTime, name: '아침밥', emoji: '🍚', sub: '', repeat: '매일', category: '식사' },
      { id: `r_${ts + 1}`, time: catData.eveningFeedTime, name: '저녁밥', emoji: '🍗', sub: '', repeat: '매일', category: '식사' }
    ]
    if (catData.hasMed) {
      routines.push({ id: `r_${ts + 2}`, time: catData.medTime, name: '약', emoji: '💊', sub: '', repeat: '매일', category: '약' })
    }

    const newCat = {
      id: String(Date.now()),
      name: name || '고양이',
      avatarVariant: catData.avatarVariant,
      photoUrl: catData.photoUrl || null,
      descriptionTag: catData.descriptionTag || '',
      personalityTag: catData.personalityTag || '',
      eyeColor: '#4db86a',
      statusPixel: '',
      statusNook: '',
      routines
    }

    const existing = JSON.parse(localStorage.getItem('meowdiaries_cats') || '[]')
    const updated = [...(Array.isArray(existing) ? existing : []), newCat]
    localStorage.setItem('meowdiaries_cats', JSON.stringify(updated))
    localStorage.setItem('meowdiaries_active_cat_id', String(newCat.id))
    window.dispatchEvent(new Event('meowdiaries_updated'))
    window.dispatchEvent(new Event('meowdiaries_data_changed'))
    close()
    navigate('/home')
  }

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {step >= 2 ? (
          <button type="button" onClick={back} className="pixel-btn px-3 py-2 text-[12px] font-main border-border bg-surface">
            ←
          </button>
        ) : (
          <div style={{ width: 44 }} />
        )}
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const active = i + 1 === step
            return (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: active ? 'var(--accent)' : 'rgba(0,0,0,0.08)'
                }}
              />
            )
          })}
        </div>
      </div>
      {required ? <div style={{ width: 44 }} /> : (
        <button type="button" onClick={close} className="pixel-btn px-3 py-2 text-[12px] font-main border-border bg-surface">
          ×
        </button>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto w-full max-w-[390px] p-4">
        {header}

        <div className="mt-4 pixel-card p-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-main">새로운 친구의 이름은요? 🐱</h2>
              </div>
              <input
                ref={nameInputRef}
                type="text"
                className="meow-field w-full px-4 py-4 text-[18px] text-center"
                placeholder="예: 리암, 노엘, 코코, 나비..."
                value={catData.name}
                onChange={(e) => setCatData((p) => ({ ...p, name: e.target.value }))}
              />
              <p className="text-xs text-muted text-center">나중에 바꿀 수 있어요</p>
              <button
                type="button"
                onClick={next}
                className="pixel-btn w-full py-3 font-main text-[12px] border-accent bg-card"
                disabled={!canNextName}
                aria-disabled={!canNextName}
                style={!canNextName ? { opacity: 0.55 } : undefined}
              >
                다음
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-[18px] font-main">어떻게 생겼어요?</h2>

              <div className="pixel-border bg-surface p-4">
                <div className="font-main text-[12px]">직접 사진 올리기</div>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={pickPhoto} className="pixel-btn px-4 py-3 font-main text-[12px] border-border bg-card">
                    사진 선택
                  </button>
                  {catData.photoUrl ? (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 999,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      <img src={catData.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : null}
                </div>
                <div className="mt-2 text-xs text-muted">AI 픽셀 변환은 곧 추가돼요 ✨</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPhotoChange} style={{ display: 'none' }} />
              </div>

              <div className="text-center text-xs text-muted">─── 또는 ───</div>

              <div>
                <div className="font-main text-[12px]">픽셀 아바타 고르기</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {avatarTiles.map((t) => {
                    const selected = catData.photoUrl ? false : catData.avatarVariant === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => selectTile(t.value)}
                        aria-pressed={selected}
                        className="pixel-btn border bg-card"
                        style={{
                          padding: 10,
                          borderColor: selected ? 'var(--accent)' : 'rgba(0,0,0,0.08)',
                          transform: selected ? 'scale(1.05)' : 'none'
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            style={{
                              width: 72,
                              height: 72,
                              borderRadius: 14,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.7)',
                              border: '1px solid rgba(0,0,0,0.06)'
                            }}
                          >
                            <CatTileSprite tile={t} />
                          </div>
                          <div className="mt-2 font-main text-[12px]">{t.label}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button type="button" onClick={next} className="pixel-btn w-full py-3 font-main text-[12px] border-accent bg-card">
                다음
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatData((p) => ({ ...p, photoUrl: null, avatarVariant: 'tuxedo' }))
                  setStep(3)
                }}
                className="w-full text-xs text-muted underline"
              >
                건너뛰기
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="text-[18px] font-main">{catData.name || '우리 고양이'}은 어떤 아이예요?</h2>
              <p className="text-xs text-muted">정확하지 않아도 괜찮아요. 편하게 적어주세요.</p>
              <input
                ref={editInputRef}
                type="text"
                className="meow-field w-full px-4 py-3 text-[15px]"
                placeholder="예: 코숏, 치즈냥, 사랑둥이, 그냥 귀여움"
                value={catData.descriptionTag}
                onChange={(e) => setCatData((p) => ({ ...p, descriptionTag: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2">
                {['코숏', '치즈냥', '턱시도냥', '고등어태비', '삼색이', '올블랙', '흰둥이', '사랑둥이', '그냥 귀여움'].map((c) => (
                  <Chip key={c} label={c} active={catData.descriptionTag === c} onClick={() => setCatData((p) => ({ ...p, descriptionTag: c }))} />
                ))}
              </div>
              <button type="button" onClick={next} className="pixel-btn w-full py-3 font-main text-[12px] border-accent bg-card">
                다음
              </button>
              <button type="button" onClick={() => setStep(4)} className="w-full text-xs text-muted underline">
                건너뛰기
              </button>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-[18px] font-main">{catData.name || '우리 고양이'}의 매력을 알려주세요</h2>
              <p className="text-xs text-muted">성격이나 특기를 짧게 적어도 좋아요.</p>
              <input
                ref={editInputRef}
                type="text"
                className="meow-field w-full px-4 py-3 text-[15px]"
                placeholder="예: 창문 구경 전문가, 츄르 감별사, 낮잠 마스터"
                value={catData.personalityTag}
                onChange={(e) => setCatData((p) => ({ ...p, personalityTag: e.target.value }))}
              />
              <div className="flex flex-wrap gap-2">
                {['창문 구경 전문가', '츄르 감별사', '낮잠 마스터', '골골송 DJ', '박스 수집가', '애교쟁이'].map((c) => (
                  <Chip key={c} label={c} active={catData.personalityTag === c} onClick={() => setCatData((p) => ({ ...p, personalityTag: c }))} />
                ))}
              </div>
              <button type="button" onClick={next} className="pixel-btn w-full py-3 font-main text-[12px] border-accent bg-card">
                다음
              </button>
              <button type="button" onClick={() => setStep(5)} className="w-full text-xs text-muted underline">
                건너뛰기
              </button>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <h2 className="text-[18px] font-main">{catData.name || '우리 고양이'}은 언제 밥 먹나요? 🍚</h2>
              <p className="text-xs text-muted">루틴을 등록하면 때맞춰 알려드려요</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <div className="text-xs text-muted">아침밥 🍚</div>
                  <input
                    ref={editInputRef}
                    type="time"
                    className="meow-field w-full px-3 py-3 text-[15px]"
                    value={catData.morningFeedTime}
                    onChange={(e) => setCatData((p) => ({ ...p, morningFeedTime: e.target.value }))}
                  />
                </label>
                <label className="space-y-1">
                  <div className="text-xs text-muted">저녁밥 🍗</div>
                  <input
                    type="time"
                    className="meow-field w-full px-3 py-3 text-[15px]"
                    value={catData.eveningFeedTime}
                    onChange={(e) => setCatData((p) => ({ ...p, eveningFeedTime: e.target.value }))}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={catData.hasMed}
                  onChange={(e) => setCatData((p) => ({ ...p, hasMed: e.target.checked }))}
                />
                약도 먹어요 💊
              </label>

              {catData.hasMed ? (
                <label className="space-y-1">
                  <div className="text-xs text-muted">약 시간 💊</div>
                  <input
                    type="time"
                    className="meow-field w-full px-3 py-3 text-[15px]"
                    value={catData.medTime}
                    onChange={(e) => setCatData((p) => ({ ...p, medTime: e.target.value }))}
                  />
                </label>
              ) : null}

              <div className="mt-2 space-y-2">
                <div className="text-xs text-muted">집사님의 이름</div>
                <input
                  type="text"
                  className="meow-field w-full px-3 py-3 text-[15px]"
                  placeholder="예: 소라, 민지, SY..."
                  value={catData.ownerName}
                  disabled={ownerLocked}
                  onChange={(e) => {
                    const v = e.target.value
                    setOwnerError('')
                    setCatData((p) => ({ ...p, ownerName: v }))
                  }}
                />
                <div className="text-xs text-muted">집사님의 마음가짐</div>
                <input
                  type="text"
                  className="meow-field w-full px-3 py-3 text-[15px]"
                  placeholder="예: 오늘도 다정하게"
                  value={catData.ownerMindset}
                  disabled={ownerLocked}
                  onChange={(e) => {
                    const v = e.target.value
                    setOwnerError('')
                    setCatData((p) => ({ ...p, ownerMindset: v }))
                  }}
                />
                <div className="text-xs text-muted">집사 상태 메시지</div>
                <div>
                  <input
                    type="text"
                    className="meow-field w-full px-3 py-3 text-[15px]"
                    placeholder="예: 오늘은 천천히, 따뜻하게 🐾"
                    value={catData.ownerStatus}
                    disabled={ownerLocked}
                    onChange={(e) => {
                      const next = clampStatus(e.target.value)
                      setOwnerError('')
                      setCatData((p) => ({ ...p, ownerStatus: next }))
                    }}
                  />
                  <div className="mt-1 text-right text-[11px]" style={{ color: 'var(--muted)' }}>
                    {String(catData.ownerStatus || '').length}/50
                  </div>
                </div>
                {ownerLocked ? (
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    집사 정보는 마이페이지에서 수정할 수 있어요
                  </div>
                ) : null}
                {ownerError ? (
                  <div className="text-xs" style={{ color: 'var(--accent)' }}>
                    {ownerError}
                  </div>
                ) : null}
              </div>

              <div className="mt-2 flex flex-col items-center">
                <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {catData.avatarVariant === 'photo' && catData.photoUrl ? (
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 999,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    >
                      <img src={catData.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CatTileSprite tile={activeTile} />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={save}
                className="pixel-btn w-full py-3 font-main text-[12px] border-accent bg-card"
                disabled={!ownerLocked && (!isValidOwnerInput(catData.ownerName) || !isValidOwnerInput(catData.ownerMindset))}
                aria-disabled={!ownerLocked && (!isValidOwnerInput(catData.ownerName) || !isValidOwnerInput(catData.ownerMindset))}
                style={!ownerLocked && (!isValidOwnerInput(catData.ownerName) || !isValidOwnerInput(catData.ownerMindset)) ? { opacity: 0.6 } : undefined}
              >
                추가하기 🐾
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
