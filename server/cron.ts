import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

export const calcTraders = async () => {
  await calcTask.calcTraderPerformances(false)
  await calcTask.calcTraderDescendants()
}
// Every hour
const calcTradersCron = cronJob.schedule('0 * * * *', calcTraders)

export const generateCaches = async () => {
  await cacheTask.generateSystemCaches()
}
// Every 12 hours
const generateCachesCron = cronJob.schedule('0 */12 * * *', generateCaches)

export const sendEmails = async () => {
  await emailTask.sendPendingEmails()
}
// Every minute
const sendEmailsCron = cronJob.schedule('* * * * *', sendEmails)

const startCron = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
  generateCachesCron.start()
  sendEmailsCron.start()
  calcTradersCron.start()
}

// istanbul ignore next
if (process.env.ENV !== 'test') {
  startCron()
}
