import * as rnaTool from '../tools/rna'

export const generateAllRNAs = async () => {
  const rnas = rnaTool.getGeneCombinations()
  return rnas
}
