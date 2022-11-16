import * as interfaces from '@shared/interfaces'
import * as traderLogic from 'logics/trader'
import * as traderPatternModel from 'models/traderPattern'

const buildTopTraderProfiles = async (
  tops: interfaces.traderModel.Tops,
): Promise<interfaces.response.TopTraderProfiles> => {
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatterns = await traderPatternModel.getPublicByTraders(topTraders)
  return {
    yearly: tops.yearly.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
  }
}

export default buildTopTraderProfiles
