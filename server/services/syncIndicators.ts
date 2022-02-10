import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as marketEnum from '../enums/market'
import * as tableEnum from '../enums/table'

type MonthlyIndicatorType =
  typeof marketEnum.TYPES.FUNDS_RATE |
  typeof marketEnum.TYPES.TREASURY_YIELD |
  typeof marketEnum.TYPES.CPI |
  typeof marketEnum.TYPES.INFLATION_EXPECTATION |
  typeof marketEnum.TYPES.CONSUMER_SENTIMENT |
  typeof marketEnum.TYPES.RETAIL_SALES |
  typeof marketEnum.TYPES.DURABLE_GOODS |
  typeof marketEnum.TYPES.UNEMPLOYMENT_RATE |
  typeof marketEnum.TYPES.NONFARM_PAYROLL
interface MonthlyIndicatorOptions {
  isTenYearsTreasury?: boolean;
  isThirtyYearsTreasury?: boolean;
}

export const syncMonthly = async (
  type: MonthlyIndicatorType,
  options?: MonthlyIndicatorOptions
): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const initMonth = dateTool.getInitialMonth()

  let indicatorResult
  let indicatorKey: indicatorMonthlyModel.IndicatorMonthlyKeys

  switch (type) {
    case marketEnum.TYPES.UNEMPLOYMENT_RATE:
      indicatorResult = await marketAdapter.getUnemploymentRate()
      indicatorKey = 'unemploymentRate'
      break
    case marketEnum.TYPES.FUNDS_RATE:
      indicatorResult = await marketAdapter.getFundsRate()
      indicatorKey = 'fundsRate'
      break
    case marketEnum.TYPES.TREASURY_YIELD: {
      const isTenYears = options?.isTenYearsTreasury
      const isThirtyYears = options?.isThirtyYearsTreasury || !isTenYears
      const queryKey = isThirtyYears
        ? marketEnum.TREASURY_TYPE.THIRTY_YEARS
        : marketEnum.TREASURY_TYPE.TEN_YEARS
      indicatorResult = await marketAdapter.getTreasuryYield(queryKey)
      indicatorKey = isThirtyYears ? 'thirtyYearsTreasury' : 'tenYearsTreasury'
      break
    }
    case marketEnum.TYPES.CPI:
      indicatorResult = await marketAdapter.getCPI()
      indicatorKey = 'cpi'
      break
    case marketEnum.TYPES.INFLATION_EXPECTATION:
      indicatorResult = await marketAdapter.getInflationExpectation()
      indicatorKey = 'inflationExpectation'
      break
    case marketEnum.TYPES.CONSUMER_SENTIMENT:
      indicatorResult = await marketAdapter.getConsumerSentiment()
      indicatorKey = 'consumerSentiment'
      break
    case marketEnum.TYPES.RETAIL_SALES:
      indicatorResult = await marketAdapter.getRetailSales()
      indicatorKey = 'retailSales'
      break
    case marketEnum.TYPES.DURABLE_GOODS:
      indicatorResult = await marketAdapter.getDurableGoods()
      indicatorKey = 'durableGoods'
      break
    case marketEnum.TYPES.NONFARM_PAYROLL:
    default:
      indicatorResult = await marketAdapter.getNonfarmPayroll()
      indicatorKey = 'nonfarmPayroll'
      break
  }

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

type QuarterlyIndicatorType = typeof marketEnum.TYPES.GDP

export const syncQuarterly = async (
  type: QuarterlyIndicatorType
): Promise<{
  relatedQuarterly: indicatorQuarterlyModel.IndicatorQuarterly[]
}> => {
  const region = 'US'
  const initQuarter = dateTool.getInitialQuarter()

  let indicatorResult
  let indicatorKey: indicatorQuarterlyModel.IndicatorQuarterlyKeys

  switch (type) {
    case marketEnum.TYPES.GDP:
    default:
      indicatorResult = await marketAdapter.getRealGDP(marketEnum.GDP_INTERVAL.QUARTERLY)
      indicatorKey = 'realGDP'
      break
  }

  const relatedIndicators = []
  for (const result of indicatorResult.data) {
    const quarter = result.date.substring(0, 7)
    if (quarter < initQuarter) continue

    const currentRecord = await indicatorQuarterlyModel.getByUK(region, quarter)
    if (!currentRecord) {
      const created = await indicatorQuarterlyModel.create({
        quarter,
        region,
        [indicatorKey]: result.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord[indicatorKey]) {
      const updated = await indicatorQuarterlyModel.update(currentRecord.id, {
        [indicatorKey]: result.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedQuarterly: relatedIndicators
  }
}

type YearlyIndicatorType =
  typeof marketEnum.TYPES.INFLATION |
  typeof marketEnum.TYPES.GDP
interface YearlyIndicatorOptions {
  valueLength?: number;
}

export const syncYearly = async (
  type: YearlyIndicatorType,
  options?: YearlyIndicatorOptions
): Promise<{
  relatedYearly: indicatorYearlyModel.IndicatorYearly[]
}> => {
  const region = 'US'
  const initYear = dateTool.getInitialYear()

  let indicatorResult
  let indicatorKey: indicatorYearlyModel.IndicatorYearlyKeys

  switch (type) {
    case marketEnum.TYPES.GDP:
      indicatorResult = await marketAdapter.getRealGDP(marketEnum.GDP_INTERVAL.YEARLY)
      indicatorKey = 'realGDP'
      break
    case marketEnum.TYPES.INFLATION:
    default:
      indicatorResult = await marketAdapter.getInflation()
      indicatorKey = 'inflation'
      break
  }

  const relatedIndicators = []
  for (const result of indicatorResult.data) {
    const year = result.date.substring(0, 4)
    if (year < initYear) continue

    const value = options?.valueLength
      ? result.value.substring(0, options.valueLength)
      : result.value

    const currentRecord = await indicatorYearlyModel.getByUK(region, year)
    if (!currentRecord) {
      const created = await indicatorYearlyModel.create({
        year,
        region,
        [indicatorKey]: value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord[indicatorKey]) {
      const updated = await indicatorYearlyModel.update(currentRecord.id, {
        [indicatorKey]: value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedYearly: relatedIndicators
  }
}
