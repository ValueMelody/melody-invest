import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as dateTool from 'tools/date'
import * as emailTask from 'tasks/email'
import * as runTool from 'tools/run'
import * as syncTask from 'tasks/sync'
import * as taskEnum from 'enums/task'
import { initConnection as initCache } from 'adapters/cache'
import { initConnection as initDatabase } from 'adapters/database'

export const run = async () => {
  const taskName = process.argv[2]

  switch (taskName) {
    case taskEnum.Name.syncTickerPrices: {
      const date = process.argv[3]
      if (!date) throw Error('Date required')
      await syncTask.syncTickerPrices(date)
      break
    }
    case taskEnum.Name.calcPriceMovements: {
      await calcTask.calcPriceMovements()
      break
    }
    case taskEnum.Name.syncTickerFinancials: {
      const quarter = process.argv[3]
      if (!quarter) throw Error('Quarter required')
      await syncTask.syncTickerFinancials(quarter)
      break
    }
    case taskEnum.Name.calcFinancialMovements: {
      await calcTask.calcFinancialMovements()
      break
    }
    case taskEnum.Name.calcIndicatorMovements: {
      await calcTask.calcIndicatorMovements()
      break
    }
    case taskEnum.Name.calcDailyIndicators: {
      const checkAll = process.argv[3]
      await calcTask.calcDailyIndicators(checkAll === 'true')
      break
    }

    case taskEnum.Name.generateDailyData: {
      const date = dateTool.getCurrentDate()
      await syncTask.syncTickerPrices(date)
      await calcTask.calcPriceMovements()
      await calcTask.calcDailyTickers(false)
      break
    }
    case taskEnum.Name.generateWeeklyData: {
      await calcTask.calcFinancialMovements()
      await calcTask.calcIndicatorMovements()

      await calcTask.calcDailyTickers(true)
      await calcTask.calcTraderPerformances(true)
      break
    }
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
      const startDate = process.argv[4] || undefined
      await calcTask.calcDailyTickers(forceRecheck, startDate)
      break
    }
    case taskEnum.Name.calcTraderAccessHashs: {
      await calcTask.calcTraderAccessHashs()
      break
    }
    case taskEnum.Name.calcTraderPerformances: {
      const forceRecheck = process.argv[3] === 'true' || false
      const checkAll = process.argv[4] === 'true' || false
      await calcTask.calcTraderPerformances(forceRecheck, checkAll)
      break
    }
    case taskEnum.Name.calcTraderDescendants: {
      await calcTask.calcTraderDescendants()
      break
    }
    default:
      throw new Error('Task does not exist')
  }
}

const startCli = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
  await run()
  process.exit(0)
}

// istanbul ignore next
if (process.env.ENV !== 'test') {
  startCli()
}
