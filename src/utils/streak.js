function localISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function updateStreak(catId, now = new Date()) {
  if (!catId) return
  const data = JSON.parse(localStorage.getItem('meowdiaries_streak_data') || '{}')
  const today = localISODate(now)
  const y = new Date(now)
  y.setDate(y.getDate() - 1)
  const yesterday = localISODate(y)
  const entry = data[catId] || { lastDate: null, count: 0 }

  if (entry.lastDate === today) return
  if (entry.lastDate === yesterday) {
    entry.count += 1
  } else {
    entry.count = 1
  }
  entry.lastDate = today
  data[catId] = entry
  localStorage.setItem('meowdiaries_streak_data', JSON.stringify(data))
}

export function getStreak(catId) {
  if (!catId) return 0
  const data = JSON.parse(localStorage.getItem('meowdiaries_streak_data') || '{}')
  return data[catId]?.count || 0
}

