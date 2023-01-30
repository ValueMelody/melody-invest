import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as dateTool from 'tools/date'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import * as syncTask from 'tasks/sync'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

// Every hour
const calcTraders = cronJob.schedule('0 * * * *', async () => {
  await calcTask.calcTraderPerformances(false)
  await calcTask.calcTraderDescendants()
})

// Every 12 hours
const caches = cronJob.schedule('0 */12 * * *', async () => {
  await cacheTask.generateSystemCaches()
})

// At 00:00, to be change to at every 30 seconds
const emails = cronJob.schedule('0 0 * * *', async () => {
  await emailTask.sendPendingEmails()
})

// At 20:30, from Monday to Friday
const daily = cronJob.schedule('30 20 * * *', async () => {
  const today = new Date()
  const todayDay = today.getDay()
  if (todayDay === 0 || todayDay === 6) return
  const date = dateTool.getCurrentDate()
  await syncTask.syncTickerPrices(date)
  await calcTask.calcPriceMovements()
  await calcTask.calcDailyTickers(false)
})

const startCron = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
  caches.start()
  emails.start()
  daily.start()
  calcTraders.start()
}

// istanbul ignore next
if (process.env.ENV !== 'test') {
  startCron()
}
