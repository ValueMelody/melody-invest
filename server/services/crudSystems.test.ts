import * as constants from '@shared/constants'
import * as crudSystems from './crudSystems'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'policy.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'policy.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getSystemPolicy', () => {
  test('could get policy', async () => {
    const result1 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy)
    expect(result1?.content).toBe('Privacy policy 2')

    const result2 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    expect(result2?.content).toBe('Terms and Conditions 1')
  })
})
