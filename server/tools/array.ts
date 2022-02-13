export const getNumberRange = (
  startNumber: number,
  endNumber: number,
): number[] => {
  const numbers = []
  for (let i = startNumber; i <= endNumber; i++) {
    numbers.push(i)
  }
  return numbers
}
