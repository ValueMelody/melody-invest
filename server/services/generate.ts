import * as dnaTool from '../tools/dna'

export const generateAllDNAs = async () => {
  const dnas = dnaTool.getGeneCombinations()
  return dnas
}
