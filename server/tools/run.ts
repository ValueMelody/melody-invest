export const sleep = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

export const asyncMap = async (items: any[], mapFunc: Function) => {
  const results = []
  for (const item of items) {
    const result = await mapFunc(item)
    results.push(result)
  }
  return results
}
