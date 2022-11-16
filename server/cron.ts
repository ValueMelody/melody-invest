import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'
import cronJob from 'node-cron'

const systemCache = cronJob.schedule('* */12 * * *', async () => {
  await crudSystems.getDefaults()
  await crudSystems.getDefaultTraderCombos()
  await crudSystems.getTopTraderProfiles()
  await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy)
  await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
})

export const init = () => {
  systemCache.start()
}
