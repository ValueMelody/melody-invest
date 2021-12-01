import * as rnaTool from '../tools/rna'

export const generateBaseRNAs = async () => {
  const rnaGroups = rnaTool.getBaseRNAs()
  return rnaGroups
}
