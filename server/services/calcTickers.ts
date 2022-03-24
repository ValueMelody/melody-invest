import * as interfaces from '@shared/interfaces'
import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as patternEnums from '../enums/pattern'
import * as databaseAdapter from '../adapters/database'
import * as runTool from '../tools/run'

const calcAverageOfRange = (
  dailyRecords: interfaces.tickerDailyModel.Record[],
): number => {
  const total = dailyRecords.reduce((total, daily) => total + daily.closePrice * daily.splitMultiplier, 0)
  return total / dailyRecords.length
}

const calcTickerAveragePrice = async (tickerId: number) => {
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(tickerDailyRecords, async (
      tickerDaily: interfaces.tickerDailyModel.Record, index: number,
    ) => {
      let hasUpdate = false

      let weeklyAverage = tickerDaily.weeklyAverageFinalPrice
      if (index >= patternEnums.DAY.WEEK && weeklyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAY.WEEK, index)
        weeklyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let monthlyAverage = tickerDaily.monthlyAverageFinalPrice
      if (index >= patternEnums.DAY.MONTH && monthlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAY.MONTH, index)
        monthlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let quarterlyAverage = tickerDaily.quarterlyAverageFinalPrice
      if (index >= patternEnums.DAY.QUARTER && quarterlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAY.QUARTER, index)
        quarterlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let yearlyAverage = tickerDaily.yearlyAverageFinalPrice
      if (index >= patternEnums.DAY.YEAR && yearlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - patternEnums.DAY.YEAR, index)
        yearlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      if (hasUpdate) {
        await tickerDailyModel.update(tickerDaily.id, {
          weeklyAverageFinalPrice: weeklyAverage === null ? null : Math.floor(weeklyAverage),
          monthlyAverageFinalPrice: monthlyAverage === null ? null : Math.floor(monthlyAverage),
          quarterlyAverageFinalPrice: quarterlyAverage === null ? null : Math.floor(quarterlyAverage),
          yearlyAverageFinalPrice: yearlyAverage === null ? null : Math.floor(yearlyAverage),
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
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerAveragePrice(ticker.id)
  })
}

const calcTickerPriceMovement = async (tickerId: number) => {
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedDaily: interfaces.tickerDailyModel.Record[] = []
    await runTool.asyncForEach(tickerDailyRecords, async (
      tickerDaily: interfaces.tickerDailyModel.Record,
    ) => {
      let dailyIncrease = tickerDaily.priceDailyIncrease
      let dailyDecrease = tickerDaily.priceDailyDecrease
      if (checkedDaily.length > 0) {
        const previousDaily = checkedDaily[checkedDaily.length - 1]
        const tickerFinalPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
        const tickerpreviousPrice = previousDaily.closePrice * previousDaily.splitMultiplier
        const priceDiffer = tickerFinalPrice - tickerpreviousPrice
        const perviousIncrease = previousDaily.priceDailyIncrease || 0
        const previousDecrease = previousDaily.priceDailyDecrease || 0
        dailyIncrease = priceDiffer > 0 ? perviousIncrease + 1 : 0
        dailyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let weeklyIncrease = tickerDaily.priceWeeklyIncrease
      let weeklyDecrease = tickerDaily.priceWeeklyDecrease
      if (checkedDaily.length > patternEnums.DAY.WEEK) {
        const previousDaily = checkedDaily[checkedDaily.length - patternEnums.DAY.WEEK]
        const priceDiffer = tickerDaily.weeklyAverageFinalPrice! - previousDaily.weeklyAverageFinalPrice!
        const previousIncrease = previousDaily.priceWeeklyIncrease || 0
        const previousDecrease = previousDaily.priceWeeklyDecrease || 0
        weeklyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        weeklyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let monthlyIncrease = tickerDaily.priceMonthlyIncrease
      let monthlyDecrease = tickerDaily.priceMonthlyDecrease
      if (checkedDaily.length > patternEnums.DAY.MONTH) {
        const previousMonthly = checkedDaily[checkedDaily.length - patternEnums.DAY.MONTH]
        const priceDiffer = tickerDaily.monthlyAverageFinalPrice! - previousMonthly.monthlyAverageFinalPrice!
        const previousIncrease = previousMonthly.priceMonthlyIncrease || 0
        const previousDecrease = previousMonthly.priceMonthlyDecrease || 0
        monthlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        monthlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let quarterlyIncrease = tickerDaily.priceQuarterlyIncrease
      let quarterlyDecrease = tickerDaily.priceQuarterlyDecrease
      if (checkedDaily.length > patternEnums.DAY.QUARTER) {
        const previousQuarterly = checkedDaily[checkedDaily.length - patternEnums.DAY.QUARTER]
        const priceDiffer = tickerDaily.quarterlyAverageFinalPrice! - previousQuarterly.quarterlyAverageFinalPrice!
        const previousIncrease = previousQuarterly.priceQuarterlyIncrease || 0
        const previousDecrease = previousQuarterly.priceQuarterlyDecrease || 0
        quarterlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        quarterlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let yearlyIncrease = tickerDaily.priceYearlyIncrease
      let yearlyDecrease = tickerDaily.priceYearlyDecrease
      if (checkedDaily.length > patternEnums.DAY.YEAR) {
        const previousYearly = checkedDaily[checkedDaily.length - patternEnums.DAY.YEAR]
        const priceDiffer = tickerDaily.yearlyAverageFinalPrice! - previousYearly.yearlyAverageFinalPrice!
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
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerPriceMovement(ticker.id)
  })
}

const calcTickerQuarterlyFinancial = async (tickerId: number) => {
  const tickerQuarterlyRecords = await tickerQuarterlyModel.getAll(tickerId)
  if (!tickerQuarterlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedQuarterly: interfaces.tickerQuarterlyModel.Record[] = []
    await runTool.asyncForEach(tickerQuarterlyRecords, async (
      tickerQuarterly: interfaces.tickerQuarterlyModel.Record,
    ) => {
      const lastRecord = checkedQuarterly.length ? checkedQuarterly[checkedQuarterly.length - 1] : null

      let epsQuarterlyBeat = tickerQuarterly.epsQuarterlyBeat
      let epsQuarterlyMiss = tickerQuarterly.epsQuarterlyMiss
      if (tickerQuarterly.eps !== null && tickerQuarterly.estimatedEPS !== null) {
        const isBeat = tickerQuarterly.eps >= tickerQuarterly.estimatedEPS
        const previousBeat = lastRecord?.epsQuarterlyBeat || 0
        const previousMiss = lastRecord?.epsQuarterlyBeat || 0
        epsQuarterlyBeat = isBeat ? previousBeat + 1 : 1
        epsQuarterlyMiss = !isBeat ? previousMiss + 1 : 1
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
        tickerQuarterly.epsQuarterlyBeat !== epsQuarterlyBeat ||
        tickerQuarterly.epsQuarterlyMiss !== epsQuarterlyMiss ||
        tickerQuarterly.revenueQuarterlyIncrease !== revenueQuarterlyIncrease ||
        tickerQuarterly.revenueQuarterlyDecrease !== revenueQuarterlyDecrease ||
        tickerQuarterly.profitQuarterlyIncrease !== profitQuarterlyIncrease ||
        tickerQuarterly.profitQuarterlyDecrease !== profitQuarterlyDecrease ||
        tickerQuarterly.incomeQuarterlyIncrease !== incomeQuarterlyIncrease ||
        tickerQuarterly.incomeQuarterlyDecrease !== incomeQuarterlyDecrease

      const quarterly = hasUpdate
        ? await tickerQuarterlyModel.update(tickerQuarterly.id, {
          epsQuarterlyBeat,
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
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerQuarterlyFinancial(ticker.id)
  })
}

const calcTickerYearlyFinancial = async (tickerId: number) => {
  const tickerYearlyRecords = await tickerYearlyModel.getAll(tickerId)
  if (!tickerYearlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const checkedYearly: interfaces.tickerYearlyModel.Record[] = []
    await runTool.asyncForEach(tickerYearlyRecords, async (
      tickerYearly: interfaces.tickerYearlyModel.Record,
    ) => {
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
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerYearlyFinancial(ticker.id)
  })
}
