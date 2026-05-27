import PixelCatIcon from './PixelCatIcon.jsx'

function PixelAvatar({ cat }) {
  return <PixelCatIcon cat={cat} size={64} style={{ borderRadius: 12 }} />
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
