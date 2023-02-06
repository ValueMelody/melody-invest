import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

// Every hour
const calcTraders = cronJob.schedule('0 * * * *', async () => {
  await calcTask.calcTraderPerformances(false)
  await calcTask.calcTraderDescendants()
})

// Every 12 hours
const generateCaches = cronJob.schedule('0 */12 * * *', async () => {
  await cacheTask.generateSystemCaches()
})

// At every minute
const sendEmails = cronJob.schedule('* * * * *', async () => {
  await emailTask.sendPendingEmails()
})

const startCron = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
  generateCaches.start()
  sendEmails.start()
  calcTraders.start()
}

// istanbul ignore next
if (process.env.ENV !== 'test') {
  startCron()
}
