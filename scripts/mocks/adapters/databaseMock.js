const database = jest.requireActual('../../../server/adapters/database')

jest.mock('../../../server/adapters/database', () => ({
  ...database,
  initConnection: database._initTestConnection,
}))
