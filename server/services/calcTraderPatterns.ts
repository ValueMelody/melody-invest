import * as interfaces from '@interfaces'
import * as traderPatternModel from '../models/traderPattern'
import * as traderModel from '../models/trader'
import * as runTool from '../tools/run'
import * as generateTool from '../tools/generate'
import * as patternLogic from '../logics/pattern'
import * as databaseAdapter from '../adapters/database'

export const calcHashCode = async () => {
  const patterns = await traderPatternModel.getAll()
  const traders = await traderModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(patterns, async (pattern: interfaces.traderPatternModel.Record) => {
      const hashCode = patternLogic.getPatternHashCode(pattern)
      const updatedPattern = await traderPatternModel.update(pattern.id, { hashCode }, transaction)
      return updatedPattern
    })

    await runTool.asyncForEach(traders, async (pattern: interfaces.traderModel.Record) => {
      const accessCode = generateTool.buildAccessHash(16)
      const updatedTrader = await traderModel.update(pattern.id, { accessCode }, transaction)
      return updatedTrader
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
