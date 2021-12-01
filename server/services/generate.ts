import * as dnaTool from '../tools/dna'

export const generateBaseDNAs = async () => {
  const dnaGroups = dnaTool.getBaseDNAs()
  return dnaGroups
}
