import { useMemo } from 'react'

function CatAvatar({ cat, size }) {
  const variant = cat?.avatarVariant || 'tuxedo'
  const eye = cat?.eyeColor || '#4db86a'

  const scale = useMemo(() => {
    const px = Number(size) || 28
    return { width: px, height: px, imageRendering: 'pixelated' }
  }, [size])

  if (variant === 'tuxedo') {
    return (
      <svg viewBox="0 0 16 16" width={scale.width} height={scale.height} style={scale} aria-hidden="true">
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
      <svg viewBox="0 0 16 16" width={scale.width} height={scale.height} style={scale} aria-hidden="true">
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
    <svg viewBox="0 0 16 16" width={scale.width} height={scale.height} style={scale} aria-hidden="true">
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
