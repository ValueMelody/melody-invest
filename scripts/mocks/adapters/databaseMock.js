const pgMem = require('pg-mem')
const { DataType } = require('pg-mem')
const crypto = require('crypto')

const initTestConnection = () => {
  const db = pgMem.newDb()
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => crypto.randomUUID(),
  })
  return db.adapters.createKnex(0)
}

const database = jest.requireActual('../../../server/adapters/database')

jest.mock('../../../server/adapters/database', () => ({
  ...database,
  initConnection: () => {
    database.setConnection(initTestConnection())
  },
}))
