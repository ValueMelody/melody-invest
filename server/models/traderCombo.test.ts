import * as traderCombo from './traderCombo'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_combo.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_combo.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('getByPK', () => {
  test('could get by PK', async () => {
    const record1 = await traderCombo.getByPK(1)
    expect(record1).toStrictEqual({
      id: 1,
      traderIds: [1, 2, 3],
    })
    const record2 = await traderCombo.getByPK(2)
    expect(record2).toStrictEqual({
      id: 2,
      traderIds: [4, 5, 6],
    })
    const record3 = await traderCombo.getByPK(4)
    expect(record3).toBeNull()
  })
})

describe('getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await traderCombo.getByUK('1,2,3')
    expect(record1).toStrictEqual({
      id: 1,
      traderIds: [1, 2, 3],
    })
    const record2 = await traderCombo.getByUK('1,2')
    expect(record2).toStrictEqual({
      id: 3,
      traderIds: [1, 2],
    })
    const record3 = await traderCombo.getByUK('1')
    expect(record3).toBeNull()
  })
})

describe('#getInPKs', () => {
  test('could get in PKs', async () => {
    const records = await traderCombo.getInPKs([1, 3])
    expect(records.length).toBe(2)
    expect(records[0].id).toBe(1)
    expect(records[1].id).toBe(3)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderCombo.create({
      traderIds: '1,3,5,7',
    }, transaction)
    await transaction.commit()
    expect(created).toStrictEqual({
      id: 4,
      traderIds: [1, 3, 5, 7],
    })

    const record = await traderCombo.getByPK(4)
    expect(record).toStrictEqual({
      id: 4,
      traderIds: [1, 3, 5, 7],
    })
  })
})

describe('#createIfEmpty', () => {
  test('could return existing one', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const result = await traderCombo.createIfEmpty({
      traderIds: '1,2,3',
    }, transaction)
    await transaction.rollback()
    expect(result).toStrictEqual({
      isNew: false,
      record: {
        id: 1,
        traderIds: [1, 2, 3],
      },
    })
  })

  test('could create new', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const result = await traderCombo.createIfEmpty({
      traderIds: '1,2,3,4,5,6',
    }, transaction)
    await transaction.commit()
    expect(result).toStrictEqual({
      isNew: true,
      record: {
        id: 5,
        traderIds: [1, 2, 3, 4, 5, 6],
      },
    })
    const record = await traderCombo.getByPK(5)
    expect(record).toStrictEqual({
      id: 5,
      traderIds: [1, 2, 3, 4, 5, 6],
    })
  })
})
