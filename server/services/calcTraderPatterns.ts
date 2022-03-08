import * as traderPatternModel from '../models/traderPattern'
import * as runTool from '../tools/run'
import * as patternLogic from '../logics/pattern'
import * as databaseAdapter from '../adapters/database'

export const calcHashCode = async () => {
  const patterns = await traderPatternModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(patterns, async (pattern: traderPatternModel.Record) => {
      const hashCode = patternLogic.getPatternHashCode(pattern)
      const updatedPattern = await traderPatternModel.update(pattern.id, { hashCode }, transaction)
      return updatedPattern
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
