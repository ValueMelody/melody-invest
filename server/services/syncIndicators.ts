import * as interfaces from '@shared/interfaces'
import * as marketAdapter from '../adapters/market'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as marketEnum from '../enums/market'
import * as databaseAdapter from '../adapters/database'

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
  options?: MonthlyIndicatorOptions,
) => {
  const initMonth = dateTool.getInitialMonth()

  let indicatorResult
  let indicatorKey: interfaces.indicatorMonthlyModel.IndicatorKey

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

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicatorResult.data, async (result: any) => {
      const month = result.date.substring(0, 7)
      if (month < initMonth) return

      const currentRecord = await indicatorMonthlyModel.getByUK(month)
      if (!currentRecord) {
        await indicatorMonthlyModel.create({
          month,
          [indicatorKey]: result.value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        await indicatorMonthlyModel.update(currentRecord.id, {
          [indicatorKey]: result.value,
        }, transaction)
      }
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

type QuarterlyIndicatorType = typeof marketEnum.TYPES.GDP

export const syncQuarterly = async (
  type: QuarterlyIndicatorType,
) => {
  const initQuarter = dateTool.getInitialQuarter()

  let indicatorResult
  let indicatorKey: interfaces.indicatorQuarterlyModel.IndicatorKey

  switch (type) {
    case marketEnum.TYPES.GDP:
    default:
      indicatorResult = await marketAdapter.getRealGDP(marketEnum.GDP_INTERVAL.QUARTERLY)
      indicatorKey = 'realGDP'
      break
  }

  const transaction = await databaseAdapter.createTransaction()
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
        await indicatorQuarterlyModel.create({
          quarter,
          reportMonth: reportAt,
          [indicatorKey]: result.value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        await indicatorQuarterlyModel.update(currentRecord.id, {
          [indicatorKey]: result.value,
        }, transaction)
      }
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
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
  options?: YearlyIndicatorOptions,
) => {
  const initYear = dateTool.getInitialYear()

  let indicatorResult
  let indicatorKey: interfaces.indicatorYearlyModel.IndicatorKey

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

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicatorResult.data, async (result: any) => {
      const year = result.date.substring(0, 4)
      if (year < initYear) return

      const value = options?.valueLength
        ? result.value.substring(0, options.valueLength)
        : result.value

      const currentRecord = await indicatorYearlyModel.getByUK(year)
      if (!currentRecord) {
        await indicatorYearlyModel.create({
          year,
          [indicatorKey]: value,
        }, transaction)
      } else if (currentRecord && !currentRecord[indicatorKey]) {
        await indicatorYearlyModel.update(currentRecord.id, {
          [indicatorKey]: value,
        }, transaction)
      }
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
