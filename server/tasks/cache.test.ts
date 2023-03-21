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
  const getDefaults = jest.fn()
  jest.spyOn(crudSystems, 'getDefaults')
    .mockImplementation(getDefaults)

  const getTopTraderProfiles = jest.fn()
  jest.spyOn(crudSystems, 'getTopTraderProfiles')
    .mockImplementation(getTopTraderProfiles)

  const getSystemPolicy = jest.fn()
  jest.spyOn(crudSystems, 'getSystemPolicy')
    .mockImplementation(getSystemPolicy)

  test('could trigger generate system caches services', async () => {
    await cache.generateSystemCaches()
    expect(getDefaults).toBeCalledTimes(1)
    expect(getDefaults).toBeCalledWith(true)
    expect(getTopTraderProfiles).toBeCalledTimes(1)
    expect(getTopTraderProfiles).toBeCalledWith(true)
    expect(getSystemPolicy).toBeCalledTimes(2)
    expect(getSystemPolicy).toHaveBeenCalledWith(
      constants.Content.PolicyType.Privacy, true,
    )
    expect(getSystemPolicy).toHaveBeenCalledWith(
      constants.Content.PolicyType.TermsAndConditions, true,
    )
  })
})
