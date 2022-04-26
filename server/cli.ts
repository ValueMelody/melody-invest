import { initConnection as initDatabase } from './adapters/database'
import { initConnection as initCache } from './adapters/cache'
import * as runTool from './tools/run'
import * as taskEnum from './enums/task'
import * as syncTask from './tasks/sync'

const run = async () => {
  try {
    const taskName = process.argv[2]

    if (!taskEnum.Name) throw new Error('Task does not exist')
    switch (taskName) {
      case taskEnum.Name.syncTickerPrices: {
        await syncTask.syncTickerPrices()
        break
      }
    }
  } catch (e) {
    console.error(`Error occured: ${e}`)
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
