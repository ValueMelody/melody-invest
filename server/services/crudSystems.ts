import * as interfaces from '@shared/interfaces'
import * as commonEnum from '../enums/common'
import * as errorEnum from '../enums/error'
import * as tickerModel from '../models/ticker'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderHoldingModel from '../models/traderHolding'
import * as runTool from '../tools/run'
import * as marketLogic from '../logics/market'
import * as traderLogic from '../logics/trader'

const getSystemTopTraderCombo = async (
  envId: number,
  total: number,
): Promise<interfaces.traderHoldingModel.Detail[]> => {
  const topTraders = await traderModel.getTopPerformancers(envId, total, 'yearlyPercentNumber')
  const traderIds = topTraders.map((trader) => trader.id)
  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = traderLogic.groupHoldingRecordsByTraders(holdings)
  const holdingsByDates = traderLogic.gatherTraderHoldingRecordsByDate(
    traderIds, holdings, holdingsByTraders,
  )

  const aggregatedHoldingDetails = Object.keys(holdingsByDates)
    .map((date) => traderLogic.mergeHoldingsByDate(
      date,
      holdingsByDates[date],
      marketLogic.getInitialCash(),
    ))
  const sortedDetails = aggregatedHoldingDetails.sort((prev, curr) => curr.date < prev.date ? -1 : 1)
  return sortedDetails
}

const getSystemTraderCombos = async (): Promise<interfaces.traderComboModel.Detail[]> => {
  const combos = commonEnum.SYSTEM_COMBOS
  const comboDetails = await runTool.asyncMap(combos, async (
    combo: interfaces.traderComboModel.Identity,
  ) => {
    switch (combo.name) {
      case 'systemCombo.default10': {
        const holdingDetails = await getSystemTopTraderCombo(combo.traderEnvId, 10)
        return {
          ...combo,
          holdingDetails: holdingDetails.slice(0, 5),
        }
      }
      case 'systemCombo.bigTech10': {
        const holdingDetails = await getSystemTopTraderCombo(combo.traderEnvId, 10)
        return {
          ...combo,
          holdingDetails: holdingDetails.slice(0, 5),
        }
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
