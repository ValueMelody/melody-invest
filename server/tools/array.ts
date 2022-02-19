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

export const asyncMap = async (items: any[], mapFunc: Function) => {
  const results = []
  for (const item of items) {
    const result = await mapFunc(item)
    results.push(result)
  }
  return results
}
