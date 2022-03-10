export const percentNumber = (value: number | null): string => {
  if (value === null) return ''
  return `${value / 100}%`
}
