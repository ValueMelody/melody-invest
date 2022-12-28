import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as dateTool from 'tools/date'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import * as syncTask from 'tasks/sync'
import * as taskEnum from 'enums/task'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

const run = async () => {
  const taskName = process.argv[2]

  switch (taskName) {
    case taskEnum.Name.generateSystemCaches: {
      await cacheTask.generateSystemCaches()
      break
    }
    case taskEnum.Name.sendPendingEmails: {
      await emailTask.sendPendingEmails()
      break
    }
    case taskEnum.Name.calcDailyTickers: {
      const forceRecheck = process.argv[3] === 'true' || false
      await calcTask.calcDailyTickers(forceRecheck)
      break
    }
    case taskEnum.Name.calcTraderAccessHashs: {
      await calcTask.calcTraderAccessHashs()
      break
    }
    case taskEnum.Name.calcTraderPerformances: {
      const forceRecheck = process.argv[3] === 'true' || false
      await calcTask.calcTraderPerformances(forceRecheck)
      break
    }
    case taskEnum.Name.calcTraderDescendants: {
      await calcTask.calcTraderDescendants()
      break
    }
    case taskEnum.Name.syncTickerPrices: {
      const date = process.argv[3] || dateTool.getCurrentDate()
      await syncTask.syncTickerPrices(date)
      break
    }
    case taskEnum.Name.syncTickerEarnings: {
      const quarter = process.argv[3] || dateTool.getCurrentQuater()
      const forceRecheck = process.argv[4] === 'true' || false
      const startTickerId = process.argv[5] ? parseInt(process.argv[5]) : null
      await syncTask.syncTickerEarnings(quarter, forceRecheck, startTickerId)
      break
    }
    case taskEnum.Name.syncTickerIncomes: {
      const quarter = process.argv[3] || dateTool.getCurrentQuater()
      const forceRecheck = process.argv[4] === 'true' || false
      const startTickerId = process.argv[5] ? parseInt(process.argv[5]) : null
      await syncTask.syncTickerIncomes(quarter, forceRecheck, startTickerId)
      break
    }
    case taskEnum.Name.calcPriceMovements: {
      await calcTask.calcPriceMovements()
      break
    }
    case taskEnum.Name.calcFinancialMovements: {
      await calcTask.calcFinancialMovements()
      break
    }
    case taskEnum.Name.syncEconomyIndicators: {
      await syncTask.syncEconomyIndicators()
      break
    }
    case taskEnum.Name.calcIndicatorMovements: {
      await calcTask.calcIndicatorMovements()
      break
    }
    default:
      throw new Error('Task does not exist')
  }
  process.exit(0)
}

const initSettings = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
}

initSettings().then(run)
