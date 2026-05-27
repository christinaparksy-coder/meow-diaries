export default function PixelCatIcon({ cat, variant, eyeColor, size = 32, style }) {
  const v = variant || cat?.avatarVariant || 'tuxedo'
  const eye = eyeColor || cat?.eyeColor || '#4db86a'
  const px = Number(size) || 32

  if (cat?.photoUrl) {
    const br = style?.borderRadius ?? 16
    return (
      <img
        src={cat.photoUrl}
        alt=""
        width={px}
        height={px}
        style={{
          width: px,
          height: px,
          borderRadius: br,
          objectFit: 'cover',
          ...style
        }}
      />
    )
  }

  const parts = getParts(v)
  const ear = parts.ear
  const face = parts.face
  const belly = parts.belly
  const leg = parts.leg
  const stripe = parts.stripe

  return (
    <svg viewBox="0 0 16 16" width={px} height={px} style={{ imageRendering: 'pixelated', ...style }} aria-hidden="true">
      <rect x="3" y="1" width="2" height="2" fill={ear} />
      <rect x="11" y="1" width="2" height="2" fill={ear} />

      <rect x="4" y="2" width="8" height="7" fill={face} />
      <rect x="3" y="3" width="10" height="6" fill={face} />

      {v === 'white_graycrown' ? (
        <>
          <rect x="4" y="2" width="8" height="1" fill={stripe} />
          <rect x="5" y="3" width="6" height="1" fill={stripe} opacity="0.9" />
        </>
      ) : null}

      {v === 'orange_tabby' || v === 'gray_tabby' ? (
        <>
          <rect x="7" y="2" width="2" height="2" fill={stripe} opacity="0.35" />
          <rect x="5" y="4" width="6" height="1" fill={stripe} opacity="0.25" />
        </>
      ) : null}

      {v === 'calico' ? (
        <>
          <rect x="4" y="2" width="3" height="3" fill="#e8833a" opacity="0.95" />
          <rect x="9" y="5" width="3" height="3" fill="#222" opacity="0.9" />
        </>
      ) : null}

      <rect x="5" y="6" width="6" height="3" fill={belly} />
      <rect x="5" y="5" width="2" height="2" fill={eye} />
      <rect x="9" y="5" width="2" height="2" fill={eye} />
      <rect x="6" y="6" width="1" height="1" fill="#111" />
      <rect x="10" y="6" width="1" height="1" fill="#111" />
      <rect x="5" y="5" width="1" height="1" fill="#fff" />
      <rect x="9" y="5" width="1" height="1" fill="#fff" />

      <rect x="7" y="7" width="2" height="1" fill="#f0a8b8" />
      <rect x="4" y="7" width="1" height="1" fill="#ffb5c8" />
      <rect x="11" y="7" width="1" height="1" fill="#ffb5c8" />

      <rect x="5" y="9" width="6" height="5" fill={belly} />
      <rect x="4" y="10" width="2" height="4" fill={leg} />
      <rect x="10" y="10" width="2" height="4" fill={leg} />

      {v === 'orange_tabby' || v === 'gray_tabby' ? (
        <>
          <rect x="4" y="11" width="2" height="1" fill={stripe} opacity="0.25" />
          <rect x="10" y="11" width="2" height="1" fill={stripe} opacity="0.25" />
        </>
      ) : null}

      <rect x="6" y="14" width="1" height="1" fill={belly} />
      <rect x="9" y="14" width="1" height="1" fill={belly} />
    </svg>
  )
}

function getParts(variant) {
  if (variant === 'tuxedo') {
    return { ear: '#222', face: '#333', belly: '#eee', leg: '#222', stripe: '#111' }
  }
  if (variant === 'white_graycrown') {
    return { ear: '#c9c9c9', face: '#f2f2f2', belly: '#fffdfa', leg: '#b8b8b8', stripe: '#b8b8b8' }
  }
  if (variant === 'orange_tabby') {
    return { ear: '#c45e1a', face: '#e8833a', belly: '#f6d7b3', leg: '#c45e1a', stripe: '#b4561a' }
  }
  if (variant === 'gray_tabby') {
    return { ear: '#666', face: '#9aa0a6', belly: '#e6e3df', leg: '#666', stripe: '#555' }
  }
  if (variant === 'calico') {
    return { ear: '#b8b8b8', face: '#f2f2f2', belly: '#fffdfa', leg: '#555', stripe: '#b8b8b8' }
  }
  if (variant === 'black') {
    return { ear: '#222', face: '#111', belly: '#2a2a2a', leg: '#222', stripe: '#222' }
  }
  return { ear: '#222', face: '#333', belly: '#eee', leg: '#222', stripe: '#111' }
}

