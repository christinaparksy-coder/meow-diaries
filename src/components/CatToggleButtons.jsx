import { useMemo } from 'react'
import PixelCatIcon from './PixelCatIcon.jsx'

function CatAvatar({ cat, size }) {
  const scale = useMemo(() => {
    const px = Number(size) || 28
    return { width: px, height: px, imageRendering: 'pixelated' }
  }, [size])

  return <PixelCatIcon cat={cat} size={scale.width} style={{ borderRadius: 999 }} />
}

export default function CatToggleButtons({ cats, activeCatId, onSelect, size = 28, stacked = false }) {
  const list = Array.isArray(cats) ? cats : []
  return (
    <div className="flex gap-2">
      {list.map((cat) => {
        const active = String(cat.id) === String(activeCatId)
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect?.(cat.id)}
            style={{
              padding: stacked ? '6px 12px' : '6px 14px 6px 8px',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: active ? 'var(--accent)' : 'var(--border)',
              borderRadius: 'var(--btn-radius)',
              background: active ? 'var(--accent-soft, var(--surface))' : 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: stacked ? 0 : 6,
              flexDirection: stacked ? 'column' : 'row',
              minWidth: stacked ? 68 : undefined
            }}
            aria-pressed={active}
          >
            <CatAvatar cat={cat} size={size} />
            <span
              className="font-body text-sm"
              style={{
                marginTop: stacked ? 4 : 0,
                fontSize: stacked ? 11 : 14,
                fontWeight: stacked ? 500 : 600,
                color: active ? 'var(--accent)' : 'var(--muted)'
              }}
            >
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
