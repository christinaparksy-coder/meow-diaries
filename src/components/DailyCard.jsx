function PixelAvatar({ cat }) {
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'

  if (cat?.photoUrl) {
    return <img src={cat.photoUrl} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
  }

  const px = 64

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

function formatKoreanDate(iso) {
  const s = String(iso || '')
  const [y, m, d] = s.split('-')
  if (!y || !m || !d) return s
  return `${y}.${m}.${d}`
}

export default function DailyCard({ cat, date, routineLogs, diaryEntry, streak }) {
  if (!cat) return null

  const logs = Array.isArray(routineLogs) ? routineLogs : []
  const routines = Array.isArray(cat.routines) ? cat.routines : []
  const memo = (diaryEntry?.text || '').toString()
  const memoHasText = memo.trim() !== ''
  const personality = cat.personalityTag || '우리 고양이 🐾'

  return (
    <div
      id="daily-card-capture"
      style={{
        position: 'fixed',
        left: -9999,
        top: -9999,
        width: 360,
        minHeight: 480,
        background: '#FFF7EE',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans KR', sans-serif",
        borderRadius: 20,
        zIndex: -1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#3D2C2C' }}>{`🐱 오늘의 ${cat.name}`}</div>
        <div style={{ fontSize: 12, color: '#9E9E9E' }}>{formatKoreanDate(date)}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <PixelAvatar cat={cat} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: '#9E9E9E', marginBottom: 16 }}>{personality}</div>

      <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', marginBottom: 16 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {routines.map((r) => {
          const done = logs.some((l) => String(l.catId) === String(cat.id) && l.routineId === r.id && l.date === date)
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 16, textAlign: 'center', fontSize: 14, color: done ? '#4CAF82' : '#9E9E9E' }}>{done ? '✔' : '—'}</div>
              <div style={{ fontSize: 14, color: done ? '#3D2C2C' : '#9E9E9E' }}>{`${r.emoji || '🐾'} ${r.name || ''}`}</div>
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', marginBottom: 16 }} />

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#9E9E9E', marginBottom: 6 }}>오늘의 메모</div>
        {memoHasText ? (
          <div
            style={{
              fontSize: 14,
              color: '#3D2C2C',
              lineHeight: 1.6,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {memo.trim()}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: '#9E9E9E', fontStyle: 'italic', lineHeight: 1.6 }}>{`${cat.name}의 하루 🐾`}</div>
        )}
      </div>

      {Number(streak) >= 3 ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: '#FFF0E8',
            color: '#FF8A65',
            borderRadius: 999,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16,
            width: 'fit-content'
          }}
        >
          {`🔥 ${streak}일 연속 기록`}
        </div>
      ) : null}

      <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', marginBottom: 16 }} />

      <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 10, color: '#9E9E9E' }}>야옹일기 · Meow Diaries</div>
    </div>
  )
}
