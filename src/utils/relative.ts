const locale = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en'
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

export function relativeTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (Math.abs(seconds) < 60) return rtf.format(-seconds, 'second')
  const minutes = Math.floor(seconds / 60)
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.floor(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
  const days = Math.floor(hours / 24)
  return rtf.format(-days, 'day')
}
