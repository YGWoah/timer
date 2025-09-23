export function generateRandomTopic(): string {
  const adjectives = ['Cool', 'Quick', 'Silent', 'Mighty', 'Bright', 'Steady', 'Sharp', 'Zen', 'Bold', 'Swift']
  const nouns = ['Focus', 'Sprint', 'Groove', 'Burst', 'Flow', 'Push', 'Session', 'Drive', 'Sprint', 'Quest']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 90) + 10
  return `${adj} ${noun} ${num}`
}

export function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
