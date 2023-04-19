import * as cache from './cache'
import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'

jest.mock('services/crudSystems', () => {
  const actual = jest.requireActual('services/crudSystems')
  return {
    __esModule: true,
    ...actual,
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('#calcPriceMovements', () => {
  const getSystemPolicy = jest.fn()
  jest.spyOn(crudSystems, 'getSystemPolicy')
    .mockImplementation(getSystemPolicy)

  test('could trigger generate system caches services', async () => {
    await cache.generateSystemCaches()
    expect(getSystemPolicy).toBeCalledTimes(2)
    expect(getSystemPolicy).toHaveBeenCalledWith(
      constants.Content.PolicyType.Privacy, true,
    )
    expect(getSystemPolicy).toHaveBeenCalledWith(
      constants.Content.PolicyType.TermsAndConditions, true,
    )
  })
})
