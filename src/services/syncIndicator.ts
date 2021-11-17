import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as marketEnum from '../enums/market'

export const syncGdpYearly = async (): Promise<{
  relatedYearly: indicatorYearlyModel.IndicatorYearly[]
}> => {
  const region = 'US'
  const gdpData = await marketAdapter.getRealGdp(marketEnum.GDP_INTERVAL.YEARLY)
  const initYear = dateTool.getInitialYear()

  const relatedIndicators = []
  for (const yearlyData of gdpData.data) {
    const year = yearlyData.date.substring(0, 4)
    if (year < initYear) continue

    const currentRecord = await indicatorYearlyModel.getByUK(region, year)
    if (!currentRecord) {
      const created = await indicatorYearlyModel.create({
        year,
        region,
        realGdp: yearlyData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.realGdp) {
      const updated = await indicatorYearlyModel.update(currentRecord.id, {
        realGdp: yearlyData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedYearly: relatedIndicators
  }
}

export const syncGdpQuarterly = async (): Promise<{
  relatedQuarterly: indicatorQuarterlyModel.IndicatorQuarterly[]
}> => {
  const region = 'US'
  const gdpData = await marketAdapter.getRealGdp(marketEnum.GDP_INTERVAL.QUARTERLY)
  const initQuarter = dateTool.getInitialQuarter()

  const relatedIndicators = []
  for (const quarterlyData of gdpData.data) {
    const quarter = quarterlyData.date.substring(0, 7)
    if (quarter < initQuarter) continue

    const currentRecord = await indicatorQuarterlyModel.getByUK(region, quarter)
    if (!currentRecord) {
      const created = await indicatorQuarterlyModel.create({
        quarter,
        region,
        realGdp: quarterlyData.value
      })
      relatedIndicators.push(created)
    } else if (currentRecord && !currentRecord.realGdp) {
      const updated = await indicatorQuarterlyModel.update(currentRecord.id, {
        realGdp: quarterlyData.value
      })
      relatedIndicators.push(updated)
    }
  }
  return {
    relatedQuarterly: relatedIndicators
  }
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
