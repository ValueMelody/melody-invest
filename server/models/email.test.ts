import * as email from './email'
import * as databaseAdapter from '../adapters/database'

const record1 = {
  id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a1',
  sendTo: 'a@company.com',
  sendBy: 'test@email.com',
  title: 'activation email',
  content: 'This is an activation email',
  status: 2,
  response: JSON.stringify({ completed: true }),
  createdAt: new Date('2019-01-01'),
  sentAt: new Date('2019-01-02'),
}

const record2 = {
  id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a2',
  sendTo: 'b@company.com',
  sendBy: 'test@email.com',
  title: 'activation email',
  content: 'This is an activation email',
  status: 0,
  response: null,
  createdAt: new Date('2019-01-01'),
  sentAt: null,
}

const record3 = {
  id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a3',
  sendTo: 'c@company.com',
  sendBy: 'test@email.com',
  title: 'set password email',
  content: 'This is reset password email',
  status: 0,
  response: null,
  createdAt: new Date('2019-01-02'),
  sentAt: null,
}

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'email.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'email.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#batchUpdate', () => {
  test('could batch update emails', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await email.batchUpdate(
      { status: 1 },
      [{ key: 'status', value: 0 }],
      20,
      transaction,
    )
    await transaction.commit()
    expect(updated.length).toBe(2)
    expect(updated[0]).toStrictEqual({
      ...record2,
      status: 1,
    })
    expect(updated[1]).toStrictEqual({
      ...record3,
      status: 1,
    })
  })
})

describe('#update', () => {
  test('could update email', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await email.update(
      record1.id,
      { status: 3 },
      transaction,
    )
    await transaction.commit()
    expect(updated).toStrictEqual({
      ...record1,
      status: 3,
    })
  })
})

describe('#create', () => {
  test('could create email', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const values = {
      sendTo: 'd@email.com',
      sendBy: 'test@email.com',
      title: 'title',
      content: 'content',
      status: 0,
    }
    const created = await email.create(
      values,
      transaction,
    )
    await transaction.commit()
    expect(created.sendTo).toBe(values.sendTo)
    expect(created.sendBy).toBe(values.sendBy)
    expect(created.title).toBe(values.title)
    expect(created.content).toBe(values.content)
    expect(created.status).toBe(values.status)
    expect(created.id).toBeDefined()
  })
})
