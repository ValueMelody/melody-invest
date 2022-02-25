import * as traderDNAModel from '../models/traderDNA'
import * as runTool from '../tools/run'
import * as dnaTool from '../tools/dna'

export const calcHashCode = async (): Promise<traderDNAModel.Record[]> => {
  const dnas = await traderDNAModel.getAll()

  const results = await runTool.asyncMap(dnas, async (dna: traderDNAModel.Record) => {
    const hashCode = dnaTool.getDNAHashCode(dna)
    const updatedDNA = await traderDNAModel.update(dna.id, { hashCode })
    return updatedDNA
  })

  return results
}
