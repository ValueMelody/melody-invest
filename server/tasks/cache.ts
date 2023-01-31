import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'

export const generateSystemCaches = async () => {
  console.info('Start generating system caches')
  const forceRecheck = true
  try {
    await crudSystems.getDefaults(forceRecheck)
    await crudSystems.getDefaultTraderCombos(forceRecheck)
    await crudSystems.getTopTraderProfiles(forceRecheck)
    await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy, forceRecheck)
    await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions, forceRecheck)
    console.info('System cache generated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}
