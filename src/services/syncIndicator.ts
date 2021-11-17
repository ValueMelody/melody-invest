import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as dateTool from '../tools/date'

export const syncGdpYearly = async (): Promise<{
  relatedYearly: indicatorYearlyModel.IndicatorYearly[]
}> => {
  const region = 'US'
  const gdpData = await marketAdapter.getRealGdpYearly()
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
