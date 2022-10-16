import * as database from './database'
import * as traderEnv from 'models/traderEnv'
import * as adapterEnum from 'enums/adapter'
import * as errorEnum from 'enums/error'

beforeAll(async () => {
  database.initConnection()
  const connection = database.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
})

afterAll(async () => {
  const connection = database.getConnection()
  await connection.destroy()
})

describe('#update', () => {
  test('could update by andWhere', async () => {
    const envs = await traderEnv.getAll()
    expect(envs[0].name).toBe('traderEnv.default')
    expect(envs[1].name).toBe(null)
    expect(envs[2].name).toBe(null)

    const transaction = await database.createTransaction()
    await database.update({
      tableName: adapterEnum.DatabaseTable.TraderEnv,
      values: { name: 'updated name' },
      conditions: [
        { key: 'name', value: 'traderEnv.default' },
        { key: 'activeTotal', value: 10000 },
      ],
      transaction,
    })
    await transaction.commit()

    const updatedEnvs = await traderEnv.getAll()
    expect(updatedEnvs[0].name).toBe('updated name')
    expect(updatedEnvs[1].name).toBe(null)
    expect(updatedEnvs[2].name).toBe(null)
  })
})

describe('#create', () => {
  test('could throw error', async () => {
    await expect(async () => {
      const transaction = await database.createTransaction()
      await database.create({
        tableName: adapterEnum.DatabaseTable.TraderEnv,
        values: {
          id: 1,
          name: 'test',
          isSystem: false,
          activeTotal: 0,
          startDate: '2000-01-01',
        },
        transaction,
      })
      await transaction.commit()
    })
      .rejects
      .toStrictEqual(errorEnum.Custom.CreationFailed)
  })
})

describe('#update', () => {
  test('do not throw error if nothing updated', async () => {
    await expect(async () => {
      const transaction = await database.createTransaction()
      await database.update({
        tableName: adapterEnum.DatabaseTable.TraderEnv,
        values: { name: 'test' },
        conditions: [
          { key: 'id', value: 111 },
        ],
        transaction,
      })
      await transaction.commit()
    })
      .not
      .toThrowError()
  })

  test('could throw error', async () => {
    await expect(async () => {
      const transaction = await database.createTransaction()
      await database.update({
        tableName: adapterEnum.DatabaseTable.TraderEnv,
        values: { name: 'test' },
        conditions: [
          { key: 'id', value: 'abc' },
        ],
        transaction,
      })
      await transaction.commit()
    })
      .rejects
      .toStrictEqual(errorEnum.Custom.UpdationFailed)
  })
})
