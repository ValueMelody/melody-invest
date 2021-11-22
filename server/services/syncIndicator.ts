import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as marketEnum from '../enums/market'
import * as tableEnum from '../enums/table'

export const syncRealGDP = async (
  interval: string
): Promise<{
  relatedIndicators: (
    indicatorYearlyModel.IndicatorYearly |
    indicatorQuarterlyModel.IndicatorQuarterly
  )[]
}> => {
  const region = 'US'
  const isYearly = interval === marketEnum.GDP_INTERVAL.YEARLY

  const gdps = await marketAdapter.getRealGDP(interval)
  const initDate = isYearly
    ? dateTool.getInitialYear()
    : dateTool.getInitialQuarter()

  const relatedIndicators = []
  for (const gdpData of gdps.data) {
    const recordDate = isYearly
      ? gdpData.date.substring(0, 4)
      : gdpData.date.substring(0, 7)

    if (recordDate < initDate) continue

    const currentRecord = isYearly
      ? await indicatorYearlyModel.getByUK(region, recordDate)
      : await indicatorQuarterlyModel.getByUK(region, recordDate)

    if (!currentRecord) {
      const created = isYearly
        ? await indicatorYearlyModel.create({
          year: recordDate,
          region,
          realGDP: gdpData.value
        })
        : await indicatorQuarterlyModel.create({
          quarter: recordDate,
          region,
          realGDP: gdpData.value
        })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.realGDP) {
      const updated = isYearly
        ? await indicatorYearlyModel.update(currentRecord.id, {
          realGDP: gdpData.value
        })
        : await indicatorQuarterlyModel.update(currentRecord.id, {
          realGDP: gdpData.value
        })
      relatedIndicators.push(updated)
    }
  }
  return { relatedIndicators }
}

export const syncInflation = async (): Promise<{
  relatedYearly: indicatorYearlyModel.IndicatorYearly[]
}> => {
  const region = 'US'
  const inflation = await marketAdapter.getInflation()
  const initYear = dateTool.getInitialYear()

  const relatedIndicators = []
  for (const inflationData of inflation.data) {
    const year = inflationData.date.substring(0, 4)
    if (year < initYear) continue

    const inflationValue = inflationData.value.substring(0, 5)

    const currentRecord = await indicatorYearlyModel.getByUK(region, year)
    if (!currentRecord) {
      const created = await indicatorYearlyModel.create({
        year,
        region,
        inflation: inflationValue
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.inflation) {
      const updated = await indicatorYearlyModel.update(currentRecord.id, {
        inflation: inflationValue
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedYearly: relatedIndicators
  }
}

type MonthlyIndicatorType =
  typeof marketEnum.TYPES.FUNDS_RATE |
  typeof marketEnum.TYPES.TREASURY_YIELD |
  typeof marketEnum.TYPES.CPI |
  typeof marketEnum.TYPES.INFLATION_EXPECTATION |
  typeof marketEnum.TYPES.CONSUMER_SENTIMENT |
  typeof marketEnum.TYPES.RETAIL_SALES |
  typeof marketEnum.TYPES.DURABLE_GOODS
interface MonthlyIndicatorOptions {
  isTenYearsTreasury?: boolean;
  isThirtyYearsTreasury?: boolean;
}

export const syncMonthlyIndicators = async (
  type: MonthlyIndicatorType,
  options?: MonthlyIndicatorOptions
): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'

  let indicatorResult
  let indicatorKey: indicatorMonthlyModel.IndicatorMonthlyKeys

  switch (type) {
    case marketEnum.TYPES.FUNDS_RATE:
      indicatorResult = await marketAdapter.getFundsRate()
      indicatorKey = tableEnum.KEYS.FUNDS_RATE
      break
    case marketEnum.TYPES.TREASURY_YIELD: {
      const isTenYears = options?.isTenYearsTreasury
      const isThirtyYears = options?.isThirtyYearsTreasury || !isTenYears
      const queryKey = isThirtyYears
        ? marketEnum.TREASURY_TYPE.THIRTY_YEARS
        : marketEnum.TREASURY_TYPE.TEN_YEARS
      indicatorResult = await marketAdapter.getTreasuryYield(queryKey)
      indicatorKey = isThirtyYears
        ? tableEnum.KEYS.THIRTY_YEARS_TREASURY
        : tableEnum.KEYS.TEN_YEARS_TREASURY
      break
    }
    case marketEnum.TYPES.CPI:
      indicatorResult = await marketAdapter.getCPI()
      indicatorKey = tableEnum.KEYS.CPI
      break
    case marketEnum.TYPES.INFLATION_EXPECTATION:
      indicatorResult = await marketAdapter.getInflationExpectation()
      indicatorKey = tableEnum.KEYS.INFLATION_EXPECTATION
      break
    case marketEnum.TYPES.CONSUMER_SENTIMENT:
      indicatorResult = await marketAdapter.getConsumerSentiment()
      indicatorKey = tableEnum.KEYS.CONSUMER_SENTIMENT
      break
    case marketEnum.TYPES.RETAIL_SALES:
      indicatorResult = await marketAdapter.getRetailSales()
      indicatorKey = tableEnum.KEYS.RETAIL_SALES
      break
    case marketEnum.TYPES.DURABLE_GOODS:
    default:
      indicatorResult = await marketAdapter.getDurableGoods()
      indicatorKey = tableEnum.KEYS.DURABLE_GOODS
      break
  }

  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const result of indicatorResult.data) {
    const month = result.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        [indicatorKey]: result.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord[indicatorKey]) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        [indicatorKey]: result.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}
