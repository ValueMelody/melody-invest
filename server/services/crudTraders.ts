import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'
import * as errorEnum from '../enums/error'

export const getTrader = async (
  id: number, accessCode: string
): Promise<interfaces.tradersResponse.TraderSummary> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.HTTP_ERRORS.FORBIDDEN

  const pattern = await traderPatternModel.getByPK(trader.traderPatternId)
  if (!pattern) throw errorEnum.HTTP_ERRORS.FORBIDDEN

  const { hashCode, ...patternPublic } = pattern

  return {
    trader,
    pattern: patternPublic,
  }
}
