import { nameWithParticle } from './koreanParticle'

function localISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null
  const [h, m] = hhmm.split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

export default function getCatStatus(cat, routineLogs, now = new Date()) {
  const todayStr = localISODate(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const nowHour = now.getHours()

  if (!cat || !Array.isArray(cat.routines) || cat.routines.length === 0) {
    return cat?.personalityTag ? `${cat.personalityTag} 🐾` : `${cat?.name || '고양이'}의 하루 🐱`
  }

  const sorted = [...cat.routines].sort((a, b) => (toMinutes(a.time) ?? 0) - (toMinutes(b.time) ?? 0))
  const logs = Array.isArray(routineLogs) ? routineLogs : []

  const isCompleted = (routine) =>
    logs.some((l) => String(l.catId) === String(cat.id) && l.routineId === routine.id && l.date === todayStr)

  for (const routine of sorted) {
    const routineMinutes = toMinutes(routine.time)
    if (routineMinutes === null) continue
    if (!isCompleted(routine) && nowMinutes > routineMinutes + 10) {
      const catName = cat.name || '고양이'
      const category = routine.category || ''
      const name = routine.name || ''
      if (category === '약' || category === 'medicine') {
        return `${nameWithParticle(catName, '이/')} 약 아직 안 먹었어요 💊`
      }
      if (category === '식사' || name.includes('밥')) {
        return `${nameWithParticle(catName, '이/')} 밥 기다리는 중 🍚`
      }
      if (name.includes('물')) {
        return '물그릇 확인이 필요해요 💧'
      }
      return `${name} 아직 안 했어요 🐾`
    }
  }

  for (const routine of sorted) {
    const routineMinutes = toMinutes(routine.time)
    if (routineMinutes === null) continue
    const diff = routineMinutes - nowMinutes
    if (!isCompleted(routine) && diff >= 0 && diff <= 30) {
      return `${nameWithParticle(cat.name, '이/')} ${routine.name} 기다리는 중이에요 ${routine.emoji || '🐾'}`
    }
  }

  try {
    const streakData = JSON.parse(localStorage.getItem('meowdiaries_streak_data') || '{}')
    const streak = streakData[String(cat.id)]?.count || 0
    if (streak >= 7) {
      return `${nameWithParticle(cat.name, '이/')} 오늘도 기다리고 있어요 ✨ ${streak}일 연속!`
    }
    if (streak >= 3) {
      return `벌써 ${streak}일 연속 기록 중이에요 🔥`
    }
  } catch {}

  const firstRoutineMinutes = toMinutes(sorted[0]?.time)
  const lastRoutineMinutes = toMinutes(sorted[sorted.length - 1]?.time)

  if (nowHour >= 0 && nowHour < 5) {
    return '우다다 타임이에요 ⚡'
  }
  if (firstRoutineMinutes !== null && nowMinutes >= firstRoutineMinutes - 30 && nowMinutes < firstRoutineMinutes) {
    return `${nameWithParticle(cat.name, '이/')} 아침을 기다리는 중 🌅`
  }
  if (lastRoutineMinutes !== null && nowMinutes > lastRoutineMinutes + 60) {
    return '슬슬 졸려해요 🌙'
  }
  if (firstRoutineMinutes !== null && lastRoutineMinutes !== null && nowMinutes >= firstRoutineMinutes && nowMinutes <= lastRoutineMinutes) {
    return '오늘 하루도 잘 지내고 있어요 🐾'
  }

  return cat.personalityTag ? `${cat.personalityTag} 🐾` : `${cat.name}의 하루 🐱`
}

