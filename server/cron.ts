import * as cacheTask from 'tasks/cache'
import * as emailTask from 'tasks/email'
import * as calcTask from 'tasks/calc'
import * as runTool from 'tools/run'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

// At every minute past every 12th hour
const systemCaches = cronJob.schedule('* */12 * * *', async () => {
  await cacheTask.generateSystemCaches()
})

// At every minute
const pendingEmails = cronJob.schedule('* * * * *', async () => {
  await emailTask.sendPendingEmails()
})

// At 19:30
const dailyPrices = cronJob.schedule('30 19 * * *', async () => {
  await calcTask.calcDailyTickers()
})

const initSettings = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
}

initSettings().then(() => {
  systemCaches.start()
  pendingEmails.start()
  dailyPrices.start()
})
