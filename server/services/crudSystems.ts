import * as interfaces from '@shared/interfaces'
import * as commonEnum from '../enums/common'
import * as errorEnum from '../enums/error'
import * as tickerModel from '../models/ticker'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as runTool from '../tools/run'
import * as presentTool from '../tools/present'
import * as marketLogic from '../logics/market'
import * as traderLogic from '../logics/trader'

const getSystemTopTraderCombo = async (
  combo: interfaces.traderComboModel.Identity,
  total: number,
): Promise<interfaces.traderRes.ComboDetail> => {
  const topTraders = await traderModel.getTopPerformancers(combo.traderEnvId, total, 'yearlyPercentNumber')
  const relatedPatterns = await traderPatternModel.getPublicByTraders(topTraders)
  const profiles = topTraders.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns))

  const traderIds = topTraders.map((trader) => trader.id)

  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = traderLogic.groupHoldingRecordsByTraders(holdings)
  const holdingsByDates = traderLogic.gatherTraderHoldingRecordsByDate(
    traderIds, holdings, holdingsByTraders,
  )

  const aggregatedHoldings = Object.keys(holdingsByDates)
    .map((date) => traderLogic.mergeHoldingsByDate(
      date,
      holdingsByDates[date],
      marketLogic.getInitialCash(),
    ))
  const sortedHoldings = aggregatedHoldings.sort((prev, curr) => curr.date < prev.date ? -1 : 1)
  return {
    identity: {
      ...combo,
      traderIds,
    },
    profiles,
    holdings: sortedHoldings.slice(0, 20),
  }
}

const getSystemTraderCombos = async (): Promise<interfaces.traderRes.ComboDetail[]> => {
  const combos = commonEnum.SYSTEM_COMBOS
  const comboDetails = await runTool.asyncMap(combos, async (
    combo: interfaces.traderComboModel.Identity,
  ) => {
    switch (combo.name) {
      case 'systemCombo.default10': {
        const comboProfile = await getSystemTopTraderCombo(combo, 10)
        return comboProfile
      }
      case 'systemCombo.bigTech10': {
        const comboProfile = await getSystemTopTraderCombo(combo, 10)
        return comboProfile
      }
      default:
        throw errorEnum.DEFAULT.FORBIDDEN
    }
  })

  return comboDetails
}

export const getDefaults = async (): Promise<interfaces.systemRes.Defaults> => {
  const systemTraderEnvs = await traderEnvModel.getSystemDefined()

  const tickers = await tickerModel.getAll()
  const tickerIdentities: interfaces.tickerModel.Identity[] = tickers.map((ticker) => ({
    id: ticker.id,
    name: ticker.name,
    region: ticker.region,
    symbol: ticker.symbol,
  }))

  const combos = await getSystemTraderCombos()

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
    traderCombos: combos,
  }
}
