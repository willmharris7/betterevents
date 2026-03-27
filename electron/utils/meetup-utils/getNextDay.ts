export function getNextDay(date: string): string {
  const currentDay = new Date(date)
  currentDay.setDate(currentDay.getDate() + 1)
  return currentDay.toISOString().split('T')[0]
}
