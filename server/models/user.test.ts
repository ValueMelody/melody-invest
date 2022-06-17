import * as user from './user'
import * as databaseAdapter from 'adapters/database'

const record1 = {
  id: 1,
  email: 'a@email.com',
  type: 1,
  password: 'abc',
  createdAt: new Date('2022-01-02'),
  updatedAt: new Date('2022-01-03'),
  deletedAt: null,
  activationSentAt: new Date('2022-01-03'),
  activationCode: 'xyz',
  resetSentAt: null,
  resetCode: null,
}

const record2 = {
  id: 2,
  email: 'b@email.com',
  type: 1,
  password: 'aabbcc',
  createdAt: new Date('2022-03-03'),
  updatedAt: new Date('2022-03-03'),
  deletedAt: null,
  activationSentAt: null,
  activationCode: null,
  resetSentAt: null,
  resetCode: null,
}

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'user.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByActivationCode', () => {
  test('could get by activationCode', async () => {
    const result1 = await user.getByActivationCode('xyz')
    expect(result1).toStrictEqual(record1)
    const result2 = await user.getByActivationCode('abc')
    expect(result2).toBe(null)
  })
})

describe('#getByPK', () => {
  test('could get by PK', async () => {
    const result1 = await user.getByPK(1)
    expect(result1).toStrictEqual(record1)
    const result2 = await user.getByPK(2)
    expect(result2).toStrictEqual(record2)
    const result3 = await user.getByPK(3)
    expect(result3).toBe(null)
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await user.getByUK('a@email.com')
    expect(result1).toStrictEqual(record1)
    const result2 = await user.getByUK('b@email.com')
    expect(result2).toStrictEqual(record2)
    const result3 = await user.getByUK('c@email.com')
    expect(result3).toBe(null)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      email: 'c@test.com',
      password: '123456789',
      type: 1,
      activationSentAt: new Date('2021-12-21'),
      activationCode: 'qwerty',
    }
    const created = await user.create(info, transaction)
    await transaction.commit()
    expect(created.id).toBe(3)
    expect(created.email).toBe(info.email)
    expect(created.password).toBe(info.password)
    expect(created.type).toBe(info.type)
    expect(created.activationSentAt?.toDateString()).toBe(info.activationSentAt.toDateString())
    expect(created.activationCode).toBe(info.activationCode)
    expect(created.deletedAt).toBe(null)
    const record = await user.getByPK(3)
    expect(record?.id).toBe(3)
    expect(record?.email).toBe(info.email)
    expect(record?.password).toBe(info.password)
    expect(record?.type).toBe(info.type)
    expect(record?.activationSentAt?.toDateString()).toBe(info.activationSentAt.toDateString())
    expect(record?.activationCode).toBe(info.activationCode)
    expect(record?.deletedAt).toBe(null)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      password: '222',
      activationSentAt: null,
      activationCode: null,
    }
    const updated = await user.update(1, info, transaction)
    await transaction.commit()
    expect(updated).toStrictEqual({ ...record1, ...info })
    const record = await user.getByPK(1)
    expect(record).toStrictEqual({ ...record1, ...info })
  })
})
