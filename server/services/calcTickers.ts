import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as patternEnums from '../enums/pattern'
import * as databaseAdapter from '../adapters/database'
import * as runTool from '../tools/run'

const calcAverageOfRange = (
  dailyRecords: tickerDailyModel.Record[],
): number => {
  const total = dailyRecords.reduce((total, daily) => total + daily.adjustedClosePrice, 0)
  return total / dailyRecords.length
}

const calcTickerAveragePrice = async (tickerId: number) => {
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(tickerDailyRecords, async (
      tickerDaily: tickerDailyModel.Record, index: number,
    ) => {
      let hasUpdate = false

      let weeklyAverage = tickerDaily.weeklyAveragePrice
      if (index >= patternEnums.DAYS.WEEK && tickerDaily.weeklyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAYS.WEEK, index)
        weeklyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let monthlyAverage = tickerDaily.monthlyAveragePrice
      if (index >= patternEnums.DAYS.MONTH && tickerDaily.monthlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAYS.MONTH, index)
        monthlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let quarterlyAverage = tickerDaily.quarterlyAveragePrice
      if (index >= patternEnums.DAYS.QUARTER && tickerDaily.quarterlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAYS.QUARTER, index)
        quarterlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let yearlyAverage = tickerDaily.yearlyAveragePrice
      if (index >= patternEnums.DAYS.YEAR && tickerDaily.yearlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAYS.YEAR, index)
        yearlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      if (hasUpdate) {
        await tickerDailyModel.update(tickerDaily.id, {
          weeklyAveragePrice: weeklyAverage ? Math.floor(weeklyAverage) : weeklyAverage,
          monthlyAveragePrice: monthlyAverage ? Math.floor(monthlyAverage) : null,
          quarterlyAveragePrice: quarterlyAverage ? Math.floor(quarterlyAverage) : null,
          yearlyAveragePrice: yearlyAverage ? Math.floor(yearlyAverage) : null,
        }, transaction)
      }
    })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTickersAveragePrice = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: tickerDailyModel.Record) => {
    await calcTickerAveragePrice(ticker.id)
  })
}

const calcTickerPriceMovement = async (tickerId: number) => {
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedDaily: tickerDailyModel.Record[] = []
    await runTool.asyncForEach(tickerDailyRecords, async (tickerDaily: tickerDailyModel.Record) => {
      let dailyIncrease = tickerDaily.priceDailyIncrease
      let dailyDecrease = tickerDaily.priceDailyDecrease
      if (checkedDaily.length > 0) {
        const previousDaily = checkedDaily[checkedDaily.length - 1]
        const priceDiffer = tickerDaily.adjustedClosePrice - previousDaily.adjustedClosePrice
        const perviousIncrease = previousDaily.priceDailyIncrease || 0
        const previousDecrease = previousDaily.priceDailyDecrease || 0
        dailyIncrease = priceDiffer > 0 ? perviousIncrease + 1 : 0
        dailyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let weeklyIncrease = tickerDaily.priceWeeklyIncrease
      let weeklyDecrease = tickerDaily.priceWeeklyDecrease
      if (checkedDaily.length > patternEnums.DAYS.WEEK) {
        const previousDaily = checkedDaily[checkedDaily.length - patternEnums.DAYS.WEEK]
        const priceDiffer = tickerDaily.weeklyAveragePrice! - previousDaily.weeklyAveragePrice!
        const previousIncrease = previousDaily.priceWeeklyIncrease || 0
        const previousDecrease = previousDaily.priceWeeklyDecrease || 0
        weeklyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        weeklyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let monthlyIncrease = tickerDaily.priceMonthlyIncrease
      let monthlyDecrease = tickerDaily.priceMonthlyDecrease
      if (checkedDaily.length > patternEnums.DAYS.MONTH) {
        const previousMonthly = checkedDaily[checkedDaily.length - patternEnums.DAYS.MONTH]
        const priceDiffer = tickerDaily.monthlyAveragePrice! - previousMonthly.monthlyAveragePrice!
        const previousIncrease = previousMonthly.priceMonthlyIncrease || 0
        const previousDecrease = previousMonthly.priceMonthlyDecrease || 0
        monthlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        monthlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let quarterlyIncrease = tickerDaily.priceQuarterlyIncrease
      let quarterlyDecrease = tickerDaily.priceQuarterlyDecrease
      if (checkedDaily.length > patternEnums.DAYS.QUARTER) {
        const previousQuarterly = checkedDaily[checkedDaily.length - patternEnums.DAYS.QUARTER]
        const priceDiffer = tickerDaily.quarterlyAveragePrice! - previousQuarterly.quarterlyAveragePrice!
        const previousIncrease = previousQuarterly.priceQuarterlyIncrease || 0
        const previousDecrease = previousQuarterly.priceQuarterlyDecrease || 0
        quarterlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        quarterlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let yearlyIncrease = tickerDaily.priceYearlyIncrease
      let yearlyDecrease = tickerDaily.priceYearlyDecrease
      if (checkedDaily.length > patternEnums.DAYS.YEAR) {
        const previousYearly = checkedDaily[checkedDaily.length - patternEnums.DAYS.YEAR]
        const priceDiffer = tickerDaily.yearlyAveragePrice! - previousYearly.yearlyAveragePrice!
        const previousIncrease = previousYearly.priceYearlyIncrease || 0
        const previousDecrease = previousYearly.priceYearlyDecrease || 0
        yearlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        yearlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      const hasUpdate = tickerDaily.priceDailyIncrease !== dailyIncrease ||
        tickerDaily.priceDailyDecrease !== dailyDecrease ||
        tickerDaily.priceWeeklyIncrease !== weeklyIncrease ||
        tickerDaily.priceWeeklyDecrease !== weeklyDecrease ||
        tickerDaily.priceMonthlyIncrease !== monthlyIncrease ||
        tickerDaily.priceMonthlyDecrease !== monthlyDecrease ||
        tickerDaily.priceQuarterlyIncrease !== quarterlyIncrease ||
        tickerDaily.priceQuarterlyDecrease !== quarterlyDecrease ||
        tickerDaily.priceYearlyIncrease !== yearlyIncrease ||
        tickerDaily.priceYearlyDecrease !== yearlyDecrease

      const daily = hasUpdate
        ? await tickerDailyModel.update(tickerDaily.id, {
          priceDailyIncrease: dailyIncrease,
          priceDailyDecrease: dailyDecrease,
          priceWeeklyIncrease: weeklyIncrease,
          priceWeeklyDecrease: weeklyDecrease,
          priceMonthlyIncrease: monthlyIncrease,
          priceMonthlyDecrease: monthlyDecrease,
          priceQuarterlyIncrease: quarterlyIncrease,
          priceQuarterlyDecrease: quarterlyDecrease,
          priceYearlyIncrease: yearlyIncrease,
          priceYearlyDecrease: yearlyDecrease,
        }, transaction)
        : tickerDaily
      checkedDaily.push(daily)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTickersPriceMovement = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: tickerDailyModel.Record) => {
    await calcTickerPriceMovement(ticker.id)
  })
}

const calcTickerQuarterlyFinancial = async (tickerId: number) => {
  const tickerQuarterlyRecords = await tickerQuarterlyModel.getAll(tickerId)
  if (!tickerQuarterlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedQuarterly: tickerQuarterlyModel.Record[] = []
    await runTool.asyncForEach(tickerQuarterlyRecords, async (tickerQuarterly: tickerQuarterlyModel.Record) => {
      const lastRecord = checkedQuarterly.length ? checkedQuarterly[checkedQuarterly.length - 1] : null

      let epsQuarterlyBeats = tickerQuarterly.epsQuarterlyBeats
      let epsQuarterlyMiss = tickerQuarterly.epsQuarterlyMiss
      if (tickerQuarterly.eps !== null && tickerQuarterly.estimatedEPS !== null) {
        const isBeats = tickerQuarterly.eps >= tickerQuarterly.estimatedEPS
        const previousBeats = lastRecord?.epsQuarterlyBeats || 0
        const previousMiss = lastRecord?.epsQuarterlyBeats || 0
        epsQuarterlyBeats = isBeats ? previousBeats + 1 : 1
        epsQuarterlyMiss = !isBeats ? previousMiss + 1 : 1
      }

      let revenueQuarterlyIncrease = tickerQuarterly.revenueQuarterlyIncrease
      let revenueQuarterlyDecrease = tickerQuarterly.revenueQuarterlyDecrease
      if (tickerQuarterly.totalRevenue !== null && lastRecord && lastRecord?.totalRevenue !== null) {
        const isIncrease = tickerQuarterly.totalRevenue > lastRecord.totalRevenue
        const isDecrease = tickerQuarterly.totalRevenue < lastRecord.totalRevenue
        const lastIncrease = lastRecord.revenueQuarterlyIncrease || 0
        const lastDecrease = lastRecord.revenueQuarterlyDecrease || 0
        revenueQuarterlyIncrease = isIncrease ? lastIncrease + 1 : 0
        revenueQuarterlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let profitQuarterlyIncrease = tickerQuarterly.profitQuarterlyIncrease
      let profitQuarterlyDecrease = tickerQuarterly.profitQuarterlyDecrease
      if (tickerQuarterly.grossProfit !== null && lastRecord && lastRecord?.grossProfit !== null) {
        const isIncrease = tickerQuarterly.grossProfit > lastRecord.grossProfit
        const isDecrease = tickerQuarterly.grossProfit < lastRecord.grossProfit
        const lastIncrease = lastRecord.profitQuarterlyIncrease || 0
        const lastDecrease = lastRecord.profitQuarterlyDecrease || 0
        profitQuarterlyIncrease = isIncrease ? lastIncrease + 1 : 0
        profitQuarterlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let incomeQuarterlyIncrease = tickerQuarterly.incomeQuarterlyIncrease
      let incomeQuarterlyDecrease = tickerQuarterly.incomeQuarterlyDecrease
      if (tickerQuarterly.netIncome !== null && lastRecord && lastRecord?.netIncome !== null) {
        const isIncrease = tickerQuarterly.netIncome > lastRecord.netIncome
        const isDecrease = tickerQuarterly.netIncome < lastRecord.netIncome
        const lastIncrease = lastRecord.incomeQuarterlyIncrease || 0
        const lastDecrease = lastRecord.incomeQuarterlyDecrease || 0
        incomeQuarterlyIncrease = isIncrease ? lastIncrease + 1 : 0
        incomeQuarterlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      const hasUpdate =
        tickerQuarterly.epsQuarterlyBeats !== epsQuarterlyBeats ||
        tickerQuarterly.epsQuarterlyMiss !== epsQuarterlyMiss ||
        tickerQuarterly.revenueQuarterlyIncrease !== revenueQuarterlyIncrease ||
        tickerQuarterly.revenueQuarterlyDecrease !== revenueQuarterlyDecrease ||
        tickerQuarterly.profitQuarterlyIncrease !== profitQuarterlyIncrease ||
        tickerQuarterly.profitQuarterlyDecrease !== profitQuarterlyDecrease ||
        tickerQuarterly.incomeQuarterlyIncrease !== incomeQuarterlyIncrease ||
        tickerQuarterly.incomeQuarterlyDecrease !== incomeQuarterlyDecrease

      const quarterly = hasUpdate
        ? await tickerQuarterlyModel.update(tickerQuarterly.id, {
          epsQuarterlyBeats,
          epsQuarterlyMiss,
          revenueQuarterlyIncrease,
          revenueQuarterlyDecrease,
          profitQuarterlyIncrease,
          profitQuarterlyDecrease,
          incomeQuarterlyIncrease,
          incomeQuarterlyDecrease,
        }, transaction)
        : tickerQuarterly

      checkedQuarterly.push(quarterly)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTickersQuarterlyFinancial = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: tickerDailyModel.Record) => {
    await calcTickerQuarterlyFinancial(ticker.id)
  })
}

const calcTickerYearlyFinancial = async (tickerId: number) => {
  const tickerYearlyRecords = await tickerYearlyModel.getAll(tickerId)
  if (!tickerYearlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedYearly: tickerYearlyModel.Record[] = []
    await runTool.asyncForEach(tickerYearlyRecords, async (tickerYearly: tickerYearlyModel.Record) => {
      const lastRecord = checkedYearly.length ? checkedYearly[checkedYearly.length - 1] : null

      let revenueYearlyIncrease = tickerYearly.revenueYearlyIncrease
      let revenueYearlyDecrease = tickerYearly.revenueYearlyDecrease
      if (tickerYearly.totalRevenue !== null && lastRecord && lastRecord?.totalRevenue !== null) {
        const isIncrease = tickerYearly.totalRevenue > lastRecord.totalRevenue
        const isDecrease = tickerYearly.totalRevenue < lastRecord.totalRevenue
        const lastIncrease = lastRecord.revenueYearlyIncrease || 0
        const lastDecrease = lastRecord.revenueYearlyDecrease || 0
        revenueYearlyIncrease = isIncrease ? lastIncrease + 1 : 0
        revenueYearlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let profitYearlyIncrease = tickerYearly.profitYearlyIncrease
      let profitYearlyDecrease = tickerYearly.profitYearlyDecrease
      if (tickerYearly.grossProfit !== null && lastRecord && lastRecord?.grossProfit !== null) {
        const isIncrease = tickerYearly.grossProfit > lastRecord.grossProfit
        const isDecrease = tickerYearly.grossProfit < lastRecord.grossProfit
        const lastIncrease = lastRecord.profitYearlyIncrease || 0
        const lastDecrease = lastRecord.profitYearlyDecrease || 0
        profitYearlyIncrease = isIncrease ? lastIncrease + 1 : 0
        profitYearlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let incomeYearlyIncrease = tickerYearly.incomeYearlyIncrease
      let incomeYearlyDecrease = tickerYearly.incomeYearlyDecrease
      if (tickerYearly.netIncome !== null && lastRecord && lastRecord?.netIncome !== null) {
        const isIncrease = tickerYearly.netIncome > lastRecord.netIncome
        const isDecrease = tickerYearly.netIncome < lastRecord.netIncome
        const lastIncrease = lastRecord.incomeYearlyIncrease || 0
        const lastDecrease = lastRecord.incomeYearlyDecrease || 0
        incomeYearlyIncrease = isIncrease ? lastIncrease + 1 : 0
        incomeYearlyDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      const hasUpdate =
        tickerYearly.revenueYearlyIncrease !== revenueYearlyIncrease ||
        tickerYearly.revenueYearlyDecrease !== revenueYearlyDecrease ||
        tickerYearly.profitYearlyIncrease !== profitYearlyIncrease ||
        tickerYearly.profitYearlyDecrease !== profitYearlyDecrease ||
        tickerYearly.incomeYearlyIncrease !== incomeYearlyIncrease ||
        tickerYearly.incomeYearlyDecrease !== incomeYearlyDecrease

      const yearly = hasUpdate
        ? await tickerYearlyModel.update(tickerYearly.id, {
          revenueYearlyIncrease,
          revenueYearlyDecrease,
          profitYearlyIncrease,
          profitYearlyDecrease,
          incomeYearlyIncrease,
          incomeYearlyDecrease,
        }, transaction)
        : tickerYearly

      checkedYearly.push(yearly)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTickersYearlyFinancial = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: tickerDailyModel.Record) => {
    await calcTickerYearlyFinancial(ticker.id)
  })
}
