import html2canvas from 'html2canvas'

export async function downloadDailyCard(catName, date) {
  const element = document.getElementById('daily-card-capture')
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#FFF7EE',
      scale: 2,
      logging: false
    })
    const link = document.createElement('a')
    link.download = `${catName || 'cat'}_${date || ''}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('카드 저장 실패:', err)
    alert('카드 저장에 실패했어요. 다시 시도해주세요 🐾')
  }
}

