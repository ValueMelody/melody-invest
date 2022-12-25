import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'

export const generateSystemCaches = async () => {
  console.info('Start generating system caches')
  try {
    await crudSystems.getDefaults()
    await crudSystems.getDefaultTraderCombos()
    await crudSystems.getTopTraderProfiles()
    await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy)
    await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    console.info('System cache generated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}
