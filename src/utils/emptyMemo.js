const EMPTY_MEMO_MESSAGES = [
  '오늘은 졸린 하루였나봐요 😴',
  '{name}은 오늘도 평범하고 소중한 하루를 보냈어요',
  '오늘은 특별한 메모 없이 지나간 하루 ✨',
  '기록은 없지만, 오늘도 함께였어요 🐾',
  '오늘은 조용한 하루였어요 ☀️'
]

export function getEmptyMemoMessage(entry, catName) {
  const seed = `${entry?.date || ''}_${entry?.catId || ''}`
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % EMPTY_MEMO_MESSAGES.length
  return EMPTY_MEMO_MESSAGES[index].replace('{name}', catName)
}

