import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as dateTool from '../tools/date'
import * as marketEnum from '../enums/market'

export const syncGdpYearly = async (): Promise<{
  relatedYearly: indicatorYearlyModel.IndicatorYearly[]
}> => {
  const region = 'US'
  const gdpData = await marketAdapter.getRealGdp(marketEnum.INTERVAL.YEARLY)
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
  const gdpData = await marketAdapter.getRealGdp(marketEnum.INTERVAL.QUARTERLY)
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
