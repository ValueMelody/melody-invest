import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import * as syncTask from 'tasks/sync'
import cronJob from 'node-cron'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

// Every 12 hours
const systemCaches = cronJob.schedule('0 */12 * * *', async () => {
  await cacheTask.generateSystemCaches()
})

// At 00:00, to be change to at every 1 minute
const pendingEmails = cronJob.schedule('0 0 * * *', async () => {
  await emailTask.sendPendingEmails()
})

// At 21:30, from Monday to Friday
const dailyPrices = cronJob.schedule('30 21 * * *', async () => {
  const today = new Date()
  const todayDay = today.getDay()
  if (todayDay === 0 || todayDay === 6) return
  await syncTask.syncTickerPrices()
  await calcTask.calcDailyTickers()
})

const initSettings = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
}

const repeatCalcTraders = async () => {
  while (true) {
    await calcTask.calcTraderPerformances()
    await calcTask.calcTraderDescendants()
  }
}

initSettings().then(() => {
  systemCaches.start()
  pendingEmails.start()
  dailyPrices.start()
  repeatCalcTraders()
})
