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

export const syncFundsRate = async (): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const fundsRate = await marketAdapter.getFundsRate()
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const rateData of fundsRate.data) {
    const month = rateData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        fundsRate: rateData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.fundsRate) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        fundsRate: rateData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}

export const syncTreasuryYeild = async (
  type: string
) => {
  const region = 'US'
  const yields = await marketAdapter.getTreasuryYield(type)
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const yieldData of yields.data) {
    const month = yieldData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    const key = type === marketEnum.TREASURY_TYPE['10_YEARS']
      ? '10YearsTreasury'
      : '30YearsTreasury'
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        [key]: yieldData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord[key]) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        [key]: yieldData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}

export const syncCPI = async (): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const cpi = await marketAdapter.getCPI()
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const cpiData of cpi.data) {
    const month = cpiData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        cpi: cpiData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.cpi) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        cpi: cpiData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
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

export const syncInflationExpectation = async (): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const inflation = await marketAdapter.getInflationExpectation()
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const inflationData of inflation.data) {
    const month = inflationData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        inflationExpectation: inflationData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.inflationExpectation) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        inflationExpectation: inflationData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}

export const syncConsumerSentiment = async (): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const sentiments = await marketAdapter.getConsumerSentiment()
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const sentimentData of sentiments.data) {
    const month = sentimentData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        consumerSentiment: sentimentData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.consumerSentiment) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        consumerSentiment: sentimentData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}

export const syncRetailSales = async (): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'
  const retailSales = await marketAdapter.getRetailSales()
  const initMonth = dateTool.getInitialMonth()

  const relatedIndicators = []
  for (const retailData of retailSales.data) {
    const month = retailData.date.substring(0, 7)
    if (month < initMonth) continue

    const currentRecord = await indicatorMonthlyModel.getByUK(region, month)
    if (!currentRecord) {
      const created = await indicatorMonthlyModel.create({
        month,
        region,
        retailSales: retailData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.retailSales) {
      const updated = await indicatorMonthlyModel.update(currentRecord.id, {
        retailSales: retailData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedMonthly: relatedIndicators
  }
}

type MonthlyIndicatorType = typeof marketEnum.TYPES.DURABLE_GOODS

export const syncMonthlyIndicators = async (
  type: MonthlyIndicatorType
): Promise<{
  relatedMonthly: indicatorMonthlyModel.IndicatorMonthly[]
}> => {
  const region = 'US'

  let indicatorResult
  let indicatorKey: typeof tableEnum.KEYS.DURABLE_GOODS
  switch (type) {
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
