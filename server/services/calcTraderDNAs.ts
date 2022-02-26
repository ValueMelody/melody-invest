import * as traderDNAModel from '../models/traderDNA'
import * as runTool from '../tools/run'
import * as dnaLogic from '../logics/dna'
import * as databaseAdapter from '../adapters/database'

export const calcHashCode = async () => {
  const dnas = await traderDNAModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(dnas, async (dna: traderDNAModel.Record) => {
      const hashCode = dnaLogic.getDNAHashCode(dna)
      const updatedDNA = await traderDNAModel.update(dna.id, { hashCode }, transaction)
      return updatedDNA
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
