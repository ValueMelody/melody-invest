import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as marketEnum from '../enums/market'

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
