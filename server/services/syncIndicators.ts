import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as indicatorMonthlyModel from 'models/indicatorMonthly'
import * as indicatorQuarterlyModel from 'models/indicatorQuarterly'
import * as indicatorYearlyModel from 'models/indicatorYearly'
import * as interfaces from '@shared/interfaces'
import * as marketAdapter from 'adapters/market'
import * as marketEnum from 'enums/market'
import * as runTool from 'tools/run'

type MonthlyIndicatorType =
  typeof marketEnum.Type.FundsRate |
  typeof marketEnum.Type.TreasuryYield |
  typeof marketEnum.Type.CPI |
  typeof marketEnum.Type.RetailSales |
  typeof marketEnum.Type.DurableGoods |
  typeof marketEnum.Type.UnemploymentRate |
  typeof marketEnum.Type.NonfarmPayroll

interface MonthlyIndicatorOptions {
  isTenYearsTreasury?: boolean;
  isThirtyYearsTreasury?: boolean;
}

export const syncMonthlyIndicator = async (
  type: MonthlyIndicatorType,
  options?: MonthlyIndicatorOptions,
) => {
  let indicatorResult
  let indicatorKey: interfaces.indicatorMonthlyModel.IndicatorKey

  switch (type) {
    case marketEnum.Type.UnemploymentRate:
      indicatorResult = await marketAdapter.getUnemploymentRate()
      indicatorKey = 'unemploymentRate'
      break
    case marketEnum.Type.FundsRate:
      indicatorResult = await marketAdapter.getFundsRate()
      indicatorKey = 'fundsRate'
      break
    case marketEnum.Type.TreasuryYield: {
      const isTenYears = options?.isTenYearsTreasury
      const isThirtyYears = options?.isThirtyYearsTreasury || !isTenYears
      const queryKey = isThirtyYears
        ? marketEnum.TreasuryType.ThirtyYears
        : marketEnum.TreasuryType.TenYears
      indicatorResult = await marketAdapter.getTreasuryYield(queryKey)
      indicatorKey = isThirtyYears ? 'thirtyYearsTreasury' : 'tenYearsTreasury'
      break
    }
    case marketEnum.Type.CPI:
      indicatorResult = await marketAdapter.getCPI()
      indicatorKey = 'cpi'
      break
    case marketEnum.Type.RetailSales:
      indicatorResult = await marketAdapter.getRetailSales()
      indicatorKey = 'retailSales'
      break
    case marketEnum.Type.DurableGoods:
      indicatorResult = await marketAdapter.getDurableGoods()
      indicatorKey = 'durableGoods'
      break
    case marketEnum.Type.NonfarmPayroll:
    default:
      indicatorResult = await marketAdapter.getNonfarmPayroll()
      indicatorKey = 'nonfarmPayroll'
      break
  }

  const initMonth = dateTool.getInitialMonth()

  const transaction = await databaseAdapter.createTransaction()

  let transactionUsed = false
  try {
    await runTool.asyncForEach(indicatorResult.data, async (result: any) => {
      const month = result.date.substring(0, 7)
      if (month < initMonth) return

      const currentRecord = await indicatorMonthlyModel.getByUK(month)
      if (!currentRecord) {
        transactionUsed = true
        await indicatorMonthlyModel.create({
          month,
          [indicatorKey]: result.value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        transactionUsed = true
        await indicatorMonthlyModel.update(currentRecord.id, {
          [indicatorKey]: result.value,
        }, transaction)
      }
    })

    if (transactionUsed) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllMonthlyIndicators = async () => {
  const normalIndicatorTypes: MonthlyIndicatorType[] = [
    marketEnum.Type.FundsRate,
    marketEnum.Type.CPI,
    marketEnum.Type.InflationExpectation,
    marketEnum.Type.ConsumerSentiment,
    marketEnum.Type.DurableGoods,
    marketEnum.Type.RetailSales,
    marketEnum.Type.UnemploymentRate,
    marketEnum.Type.NonfarmPayroll,
  ]

  const cooldown = marketAdapter.getCooldownPerMin()

  await runTool.asyncForEach(normalIndicatorTypes, async (
    type: MonthlyIndicatorType,
  ) => {
    await syncMonthlyIndicator(type)
    await runTool.sleep(cooldown)
  })

  await syncMonthlyIndicator(
    marketEnum.Type.TreasuryYield,
    { isThirtyYearsTreasury: true },
  )

  await runTool.sleep(cooldown)

  await syncMonthlyIndicator(
    marketEnum.Type.TreasuryYield,
    { isTenYearsTreasury: true },
  )
}

type QuarterlyIndicatorType = typeof marketEnum.Type.GDP

export const syncQuarterly = async (
  type: QuarterlyIndicatorType,
) => {
  const initQuarter = dateTool.getInitialQuarter()

  let indicatorResult
  let indicatorKey: interfaces.indicatorQuarterlyModel.IndicatorKey

  switch (type) {
    case marketEnum.Type.GDP:
    default:
      indicatorResult = await marketAdapter.getRealGDP(marketEnum.GDPInterval.Quarterly)
      indicatorKey = 'realGDP'
      break
  }

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false

  try {
    await runTool.asyncForEach(indicatorResult.data, async (result: any) => {
      const reportAt = result.date.substring(0, 7)
      const [reportYear, reportMonth] = reportAt.split('-')
      let quarter = reportAt
      if (reportMonth === '04') {
        quarter = `${reportYear}-03`
      } else if (reportMonth === '07') {
        quarter = `${reportYear}-06`
      } else if (reportMonth === '10') {
        quarter = `${reportYear}-09`
      } else if (reportMonth === '01') {
        const previousYear = dateTool.getPreviousYear(reportYear)
        quarter = `${previousYear}-12`
      }

      if (quarter < initQuarter) return

      const currentRecord = await indicatorQuarterlyModel.getByUK(quarter)
      if (!currentRecord) {
        transactionUsed = true
        await indicatorQuarterlyModel.create({
          quarter,
          reportMonth: reportAt,
          [indicatorKey]: result.value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        transactionUsed = true
        await indicatorQuarterlyModel.update(currentRecord.id, {
          [indicatorKey]: result.value,
        }, transaction)
      }
    })

    if (transactionUsed) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

type YearlyIndicatorType =
  typeof marketEnum.Type.Inflation |
  typeof marketEnum.Type.GDP
interface YearlyIndicatorOptions {
  valueLength?: number;
}

export const syncYearly = async (
  type: YearlyIndicatorType,
  options?: YearlyIndicatorOptions,
) => {
  const initYear = dateTool.getInitialYear()

  let indicatorResult
  let indicatorKey: interfaces.indicatorYearlyModel.IndicatorKey

  switch (type) {
    case marketEnum.Type.GDP:
      indicatorResult = await marketAdapter.getRealGDP(marketEnum.GDPInterval.Yearly)
      indicatorKey = 'realGDP'
      break
    case marketEnum.Type.Inflation:
    default:
      indicatorResult = await marketAdapter.getInflation()
      indicatorKey = 'inflation'
      break
  }

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false

  try {
    await runTool.asyncForEach(indicatorResult.data, async (result: any) => {
      const year = result.date.substring(0, 4)
      if (year < initYear) return

      const value = options?.valueLength
        ? result.value.substring(0, options.valueLength)
        : result.value

      const currentRecord = await indicatorYearlyModel.getByUK(year)
      if (!currentRecord) {
        transactionUsed = true
        await indicatorYearlyModel.create({
          year,
          [indicatorKey]: value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        transactionUsed = true
        await indicatorYearlyModel.update(currentRecord.id, {
          [indicatorKey]: value,
        }, transaction)
      }
    })

    if (transactionUsed) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllYearlyIndicators = async () => {
  const cooldown = marketAdapter.getCooldownPerMin()

  await syncYearly(marketEnum.Type.Inflation, { valueLength: 5 })

  await runTool.sleep(cooldown)

  await syncYearly(marketEnum.Type.GDP)
}
