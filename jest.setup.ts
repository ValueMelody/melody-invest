// jest.setup.ts
import * as databaseAdapter from './server/adapters/database'

const setup = async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.latest({ directory: './server/migrations' })
}

export default setup
