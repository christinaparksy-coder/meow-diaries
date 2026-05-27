export function nameWithParticle(name, particleType) {
  if (!name) return ''
  const lastChar = name[name.length - 1]
  const code = lastChar.charCodeAt(0)
  const hasBatchim = (code - 0xac00) % 28 !== 0

  if (particleType === '이/가') return name + (hasBatchim ? '이' : '가')
  if (particleType === '은/는') return name + (hasBatchim ? '은' : '는')
  if (particleType === '이/') return name + (hasBatchim ? '이' : '')
  return name
}

