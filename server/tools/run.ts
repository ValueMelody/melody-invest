import * as databaseAdapter from 'adapters/database'

export const sleep = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

export const asyncForEach = async (items: any[], mapFunc: Function) => {
  let index = -1
  for (const item of items) {
    index += 1
    await mapFunc(item, index)
  }
}

export const asyncMap = async (items: any[], mapFunc: Function) => {
  const results = []
  let index = -1
  for (const item of items) {
    index += 1
    const result = await mapFunc(item, index)
    results.push(result)
  }
  return results
}

export const withTransaction = async (
  func: (transaction: databaseAdapter.Transaction) => any,
): Promise<any> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    const result = await func(transaction)
    await transaction.commit()
    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
