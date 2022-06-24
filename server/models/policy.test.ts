import * as constants from '@shared/constants'
import * as policy from './policy'
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

describe('#getLatest', () => {
  test('could get latest', async () => {
    const privacy = await policy.getLatest(constants.Content.PolicyType.Privacy)
    expect(privacy?.id).toBe(3)
    expect(privacy?.content).toBe('Privacy policy 2')

    const terms = await policy.getLatest(constants.Content.PolicyType.TermsAndConditions)
    expect(terms?.id).toBe(2)
    expect(terms?.content).toBe('Terms and Conditions 1')
  })
})
