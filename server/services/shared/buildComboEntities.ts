import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as traderPatternModel from '../../models/traderPattern'
import * as traderHoldingModel from '../../models/traderHolding'
import * as traderLogic from '../../logics/trader'

const buildComboEntities = async (
  traders: interfaces.traderModel.Record[],
): Promise<{
  traderProfiles: interfaces.response.TraderProfile[];
  holdings: interfaces.traderHoldingModel.Detail[];
}> => {
  const relatedPatterns = await traderPatternModel.getPublicByTraders(traders)
  const profiles = traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns))

  const traderIds = traders.map((trader) => trader.id)
  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = traderLogic.groupHoldingRecordsByTraders(holdings)
  const holdingsByDates = traderLogic.gatherTraderHoldingRecordsByDate(
    traderIds, holdings, holdingsByTraders,
  )

  const aggregatedHoldings = Object.keys(holdingsByDates)
    .map((date) => traderLogic.mergeHoldingsByDate(
      date,
      holdingsByDates[date],
      constants.Trader.Initial.Cash,
    ))
  const sortedHoldings = aggregatedHoldings.sort((prev, curr) => curr.date < prev.date ? -1 : 1)

  return {
    traderProfiles: profiles,
    holdings: sortedHoldings,
  }
}

export default buildComboEntities
