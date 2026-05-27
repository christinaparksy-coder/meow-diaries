let keyPromise = null

function toB64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

function fromB64(b64) {
  const s = atob(b64)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

async function getOrCreateKey() {
  if (keyPromise) return keyPromise
  keyPromise = (async () => {
    const stored = localStorage.getItem('meowdiaries_crypto_key_v1')
    if (stored) {
      const raw = fromB64(stored)
      return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
    }
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
    localStorage.setItem('meowdiaries_crypto_key_v1', toB64(raw))
    return key
  })()
  return keyPromise
}

export async function encryptText(plainText) {
  const text = String(plainText ?? '')
  const key = await getOrCreateKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(text)
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded))
  return `${toB64(iv)}.${toB64(encrypted)}`
}

export async function decryptText(payload) {
  try {
    const raw = String(payload ?? '')
    if (!raw) return ''
    const [ivB64, dataB64] = raw.split('.')
    if (!ivB64 || !dataB64) return ''
    const iv = fromB64(ivB64)
    const data = fromB64(dataB64)
    const key = await getOrCreateKey()
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return new TextDecoder().decode(decrypted)
  } catch {
    return ''
  }
}

export async function hydrateDiaryEntries(rawEntries) {
  const input = Array.isArray(rawEntries) ? rawEntries : []
  let changed = false
  const hydrated = []
  const persisted = []

  for (const e of input) {
    if (!e || typeof e !== 'object') continue

    const textEnc = typeof e.textEnc === 'string' && e.textEnc ? e.textEnc : ''
    const plain = (e.text ?? '').toString()

    if (textEnc) {
      const text = await decryptText(textEnc)
      hydrated.push({ ...e, text, textEnc })
      persisted.push({ ...e, text: '', textEnc })
      continue
    }

    if (plain.trim()) {
      const nextEnc = await encryptText(plain)
      changed = true
      hydrated.push({ ...e, text: plain, textEnc: nextEnc })
      persisted.push({ ...e, text: '', textEnc: nextEnc })
      continue
    }

    hydrated.push({ ...e, text: plain, textEnc: '' })
    persisted.push({ ...e, text: plain, textEnc: '' })
  }

  return { entries: hydrated, persistedEntries: persisted, changed }
}

