export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export default {
  formatDate,
  isToday
}