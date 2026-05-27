import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const seedCats = [
  {
    id: 'liam',
    name: '리암',
    coat: 'tuxedo',
    eyeColor: '#4db86a',
    avatarVariant: 'tuxedo',
    personalityTag: '창문 구경 전문가',
    statusPixel: '지금 창문 구경 중… 🐦',
    statusNook: '나뭇잎 굴리는 중 🍃',
    routines: [
      { id: 'r1', time: '08:00', name: '아침밥', sub: '습식 50g', emoji: '🍚', repeat: '매일' },
      { id: 'r2', time: '14:00', name: '물 갈기', sub: '정수기 필터', emoji: '💧', repeat: '매일' },
      { id: 'r3', time: '20:00', name: '저녁 약', sub: '월·수·금', emoji: '💊', repeat: 'weekly' },
      { id: 'r4', time: '20:30', name: '저녁밥', sub: '건식 30g', emoji: '🍗', repeat: '매일' }
    ]
  },
  {
    id: 'noel',
    name: '노엘',
    coat: 'white',
    eyeColor: '#5bc0eb',
    avatarVariant: 'white_graycrown',
    personalityTag: '햇빛 자리 수집가',
    statusPixel: '햇빛 자리 차지하는 중… ☀️',
    statusNook: '따뜻한 자리 찾는 중 🌿',
    routines: [
      { id: 'r5', time: '08:00', name: '아침밥', sub: '습식 40g', emoji: '🍚', repeat: '매일' },
      { id: 'r6', time: '10:00', name: '브러싱', sub: '흰털 빠짐 주의', emoji: '🪮', repeat: '매일' },
      { id: 'r7', time: '14:00', name: '놀아주기', sub: '낚시대 15분', emoji: '🎾', repeat: '매일' },
      { id: 'r8', time: '20:30', name: '저녁밥', sub: '건식 25g', emoji: '🍗', repeat: '매일' }
    ]
  }
]

function applyTheme(theme) {
  const next = String(theme || '')
  const t = ['standard', 'pixel', 'nook', 'dreamy'].includes(next) ? next : 'standard'
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('meowdiaries_theme', t)
}

function bootstrapLocalData() {
  const stored = localStorage.getItem('meowdiaries_theme') || ''
  const theme = ['standard', 'pixel', 'nook', 'dreamy'].includes(stored) ? stored : 'standard'
  document.documentElement.setAttribute('data-theme', theme)
  if (stored !== theme) localStorage.setItem('meowdiaries_theme', theme)

  const catsRaw = localStorage.getItem('meowdiaries_cats')
  if (!catsRaw) localStorage.setItem('meowdiaries_cats', JSON.stringify(seedCats))

  const logsRaw = localStorage.getItem('meowdiaries_routine_logs')
  if (!logsRaw) localStorage.setItem('meowdiaries_routine_logs', JSON.stringify([]))

  const diaryRaw = localStorage.getItem('meowdiaries_diary_entries')
  if (!diaryRaw) localStorage.setItem('meowdiaries_diary_entries', JSON.stringify([]))
}

bootstrapLocalData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App onThemeChange={applyTheme} />
    </BrowserRouter>
  </React.StrictMode>
)
