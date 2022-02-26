import * as dnaLogic from '../logics/dna'
import * as generateTool from '../tools/generate'
import * as traderDNAModel from '../models/traderDNA'

export const generateRandomDNAs = async () => {
  const dnaGroups = dnaLogic.getGeneGroups()
  const dnaGenes = Array(5).fill(null).map(() => (
    dnaGroups.map((dnaGroup) => {
      const randomIndex = generateTool.pickNumberInRange(0, dnaGroup.length - 1)
      return dnaGroup[randomIndex]
    })
  ))
  const newDNAs = []
  for (const genes of dnaGenes) {
    const dnaString = JSON.stringify(genes)
    const hashCode = generateTool.toSHA512(dnaString)
    const currentDNA = await traderDNAModel.getByUK(hashCode)
    if (currentDNA) return
    const geneValues = genes.reduce((values, gene) => {
      return {
        ...values,
        [gene.type]: gene.value,
      }
    }, {})
    const newDNA = await traderDNAModel.create({
      ...geneValues,
      hashCode,
    })
    newDNAs.push(newDNA)
  }
  return newDNAs
}
