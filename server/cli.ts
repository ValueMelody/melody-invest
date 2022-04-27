import { initConnection as initDatabase } from './adapters/database'
import { initConnection as initCache } from './adapters/cache'
import * as runTool from './tools/run'
import * as taskEnum from './enums/task'
import * as syncTask from './tasks/sync'

const run = async () => {
  try {
    const taskName = process.argv[2]

    switch (taskName) {
      case taskEnum.Name.syncTickerPrices: {
        await syncTask.syncTickerPrices()
        break
      }
      case taskEnum.Name.syncTickerEarnings: {
        await syncTask.syncTickerEarnings()
        break
      }
      case taskEnum.Name.syncTickerIncomes: {
        await syncTask.syncTickerIncomes()
        break
      }
      case taskEnum.Name.syncMonthlyIndicators: {
        await syncTask.syncMonthlyIndicators()
        break
      }
      case taskEnum.Name.syncQuarterlyIndicators: {
        await syncTask.syncQuarterlyIndicators()
        break
      }
      case taskEnum.Name.syncYearlyIndicators: {
        await syncTask.syncYearlyIndicators()
        break
      }
      default:
        throw new Error('Task does not exist')
    }
  } catch (e) {
    console.error(`Error occured: ${JSON.stringify(e)}`)
  } finally {
    process.exit(0)
  }
}

const initSettings = async () => {
  initDatabase()
  initCache()
  await runTool.sleep(2)
}

initSettings().then(run)
