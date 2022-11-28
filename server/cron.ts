import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'
import * as runTool from 'tools/run'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

const systemCache = cronJob.schedule('* */12 * * *', async () => {
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
})

const initSettings = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(1)
}

initSettings().then(() => {
  systemCache.start()
})
