import * as cacheAdapter from 'adapters/cache'
import * as cacheTask from 'tasks/cache'
import * as calcTool from 'tools/calc'
import * as constants from '@shared/constants'
import * as dailyTickersModel from 'models/dailyTickers'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as indicatorMonthlyModel from 'models/indicatorMonthly'
import * as indicatorQuarterlyModel from 'models/indicatorQuarterly'
import * as indicatorYearlyModel from 'models/indicatorYearly'
import * as interfaces from '@shared/interfaces'
import * as runTool from 'tools/run'
import * as tickerDailyModel from 'models/tickerDaily'
import * as tickerModel from 'models/ticker'
import * as tickerQuarterlyModel from 'models/tickerQuarterly'
import * as tickerYearlyModel from 'models/tickerYearly'

const calcAverageOfRange = (
  dailyRecords: interfaces.tickerDailyModel.Record[],
): number => {
  const total = dailyRecords.reduce((total, daily) => total + daily.closePrice * daily.splitMultiplier, 0)
  return total / dailyRecords.length
}

const calcTickerAveragePrice = async (tickerId: number) => {
  console.info(`checking ${tickerId}`)
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    await runTool.asyncForEach(tickerDailyRecords, async (
      tickerDaily: interfaces.tickerDailyModel.Record, index: number,
    ) => {
      let hasUpdate = false

      let weeklyAverage = tickerDaily.weeklyAverageFinalPrice
      if (index >= constants.Trader.Day.Week && weeklyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - constants.Trader.Day.Week, index)
        weeklyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let monthlyAverage = tickerDaily.monthlyAverageFinalPrice
      if (index >= constants.Trader.Day.Month && monthlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - constants.Trader.Day.Month, index)
        monthlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let quarterlyAverage = tickerDaily.quarterlyAverageFinalPrice
      if (index >= constants.Trader.Day.Quarter && quarterlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - constants.Trader.Day.Quarter, index)
        quarterlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      let yearlyAverage = tickerDaily.yearlyAverageFinalPrice
      if (index >= constants.Trader.Day.Year && yearlyAverage === null) {
        const relatedDaily = tickerDailyRecords.slice(index - constants.Trader.Day.Year, index)
        yearlyAverage = calcAverageOfRange(relatedDaily)
        hasUpdate = true
      }

      if (hasUpdate) {
        transactionUsed = hasUpdate
        await tickerDailyModel.update(tickerDaily.id, {
          weeklyAverageFinalPrice: weeklyAverage === null ? null : Math.floor(weeklyAverage),
          monthlyAverageFinalPrice: monthlyAverage === null ? null : Math.floor(monthlyAverage),
          quarterlyAverageFinalPrice: quarterlyAverage === null ? null : Math.floor(quarterlyAverage),
          yearlyAverageFinalPrice: yearlyAverage === null ? null : Math.floor(yearlyAverage),
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

export const calcAllTickersAveragePrice = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerAveragePrice(ticker.id)
  })
}

const calcTickerPriceMovement = async (tickerId: number) => {
  console.info(`checking ${tickerId}`)
  const tickerDailyRecords = await tickerDailyModel.getAll(tickerId)
  if (!tickerDailyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
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
      if (checkedDaily.length > constants.Trader.Day.Week) {
        const previousDaily = checkedDaily[checkedDaily.length - constants.Trader.Day.Week]
        const priceDiffer = tickerDaily.weeklyAverageFinalPrice! - previousDaily.weeklyAverageFinalPrice!
        const previousIncrease = previousDaily.priceWeeklyIncrease || 0
        const previousDecrease = previousDaily.priceWeeklyDecrease || 0
        weeklyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        weeklyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let monthlyIncrease = tickerDaily.priceMonthlyIncrease
      let monthlyDecrease = tickerDaily.priceMonthlyDecrease
      if (checkedDaily.length > constants.Trader.Day.Month) {
        const previousMonthly = checkedDaily[checkedDaily.length - constants.Trader.Day.Month]
        const priceDiffer = tickerDaily.monthlyAverageFinalPrice! - previousMonthly.monthlyAverageFinalPrice!
        const previousIncrease = previousMonthly.priceMonthlyIncrease || 0
        const previousDecrease = previousMonthly.priceMonthlyDecrease || 0
        monthlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        monthlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let quarterlyIncrease = tickerDaily.priceQuarterlyIncrease
      let quarterlyDecrease = tickerDaily.priceQuarterlyDecrease
      if (checkedDaily.length > constants.Trader.Day.Quarter) {
        const previousQuarterly = checkedDaily[checkedDaily.length - constants.Trader.Day.Quarter]
        const priceDiffer = tickerDaily.quarterlyAverageFinalPrice! - previousQuarterly.quarterlyAverageFinalPrice!
        const previousIncrease = previousQuarterly.priceQuarterlyIncrease || 0
        const previousDecrease = previousQuarterly.priceQuarterlyDecrease || 0
        quarterlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        quarterlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let yearlyIncrease = tickerDaily.priceYearlyIncrease
      let yearlyDecrease = tickerDaily.priceYearlyDecrease
      if (checkedDaily.length > constants.Trader.Day.Year) {
        const previousYearly = checkedDaily[checkedDaily.length - constants.Trader.Day.Year]
        const priceDiffer = tickerDaily.yearlyAverageFinalPrice! - previousYearly.yearlyAverageFinalPrice!
        const previousIncrease = previousYearly.priceYearlyIncrease || 0
        const previousDecrease = previousYearly.priceYearlyDecrease || 0
        yearlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        yearlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      const hasUpdate =
        tickerDaily.priceDailyIncrease !== dailyIncrease ||
        tickerDaily.priceDailyDecrease !== dailyDecrease ||
        tickerDaily.priceWeeklyIncrease !== weeklyIncrease ||
        tickerDaily.priceWeeklyDecrease !== weeklyDecrease ||
        tickerDaily.priceMonthlyIncrease !== monthlyIncrease ||
        tickerDaily.priceMonthlyDecrease !== monthlyDecrease ||
        tickerDaily.priceQuarterlyIncrease !== quarterlyIncrease ||
        tickerDaily.priceQuarterlyDecrease !== quarterlyDecrease ||
        tickerDaily.priceYearlyIncrease !== yearlyIncrease ||
        tickerDaily.priceYearlyDecrease !== yearlyDecrease

      if (hasUpdate) transactionUsed = true

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

export const calcAllTickersPriceMovement = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerPriceMovement(ticker.id)
  })
}

const calcTickerQuarterlyFinancial = async (tickerId: number) => {
  console.info(`checking ${tickerId}`)
  const tickerQuarterlyRecords = await tickerQuarterlyModel.getAll(tickerId)
  if (!tickerQuarterlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    const checkedQuarterly: interfaces.tickerQuarterlyModel.Record[] = []
    await runTool.asyncForEach(tickerQuarterlyRecords, async (
      tickerQuarterly: interfaces.tickerQuarterlyModel.Record,
    ) => {
      const lastRecord = checkedQuarterly.length ? checkedQuarterly[checkedQuarterly.length - 1] : null
      const priceRecord = await tickerDailyModel.getPreviousOne(tickerId, tickerQuarterly.earningDate)

      const bookValue = calcTool.calcBookValue(tickerQuarterly.totalAssets, tickerQuarterly.totalLiabilities)

      const closePrice = priceRecord ? priceRecord.closePrice / 100 : null
      const pbRatio = calcTool.calcPbRatio(closePrice, bookValue, tickerQuarterly.outstandingShares)

      const pastFourQuarters = [...checkedQuarterly.slice(-3), tickerQuarterly]
      const totalEps = checkedQuarterly.length >= 3
        ? pastFourQuarters.reduce((total, quarterly) => {
          if (total === null || quarterly.eps === null) return null
          return total + quarterly.eps
        }, 0 as number | null)
        : null
      const peRatio = calcTool.calcPeRatio(closePrice, totalEps)

      const totalRevenue = checkedQuarterly.length >= 3
        ? pastFourQuarters.reduce((total, quarterly) => {
          if (total === null || quarterly.totalRevenue === null) return null
          return total + quarterly.totalRevenue
        }, 0 as number | null)
        : null
      const psRatio = calcTool.calcPsRatio(closePrice, totalRevenue, tickerQuarterly.outstandingShares)

      const grossMarginQoQ = calcTool.calcQoQChangePercent(tickerQuarterly.grossMargin, lastRecord?.grossMargin)
      const debtEquityQoQ = calcTool.calcQoQChangePercent(tickerQuarterly.debtEquity, lastRecord?.debtEquity)

      const hasBaseUpdate =
        tickerQuarterly.bookValue !== bookValue ||
        tickerQuarterly.pbRatio !== pbRatio ||
        tickerQuarterly.peRatio !== peRatio ||
        tickerQuarterly.psRatio !== psRatio ||
        tickerQuarterly.grossMarginQoQ !== grossMarginQoQ ||
        tickerQuarterly.debtEquityQoQ !== debtEquityQoQ

      tickerQuarterly.bookValue = bookValue
      tickerQuarterly.pbRatio = pbRatio
      tickerQuarterly.peRatio = peRatio
      tickerQuarterly.psRatio = psRatio
      tickerQuarterly.grossMarginQoQ = grossMarginQoQ !== null ? parseFloat(grossMarginQoQ) : null
      tickerQuarterly.debtEquityQoQ = debtEquityQoQ !== null ? parseFloat(debtEquityQoQ) : null

      const {
        increaseValue: pbQuarterlyIncrease,
        decreaseValue: pbQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'pbQuarterlyIncrease',
        'pbQuarterlyDecrease',
        'pbRatio',
      )

      const {
        increaseValue: psQuarterlyIncrease,
        decreaseValue: psQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'psQuarterlyIncrease',
        'psQuarterlyDecrease',
        'psRatio',
      )

      const {
        increaseValue: peQuarterlyIncrease,
        decreaseValue: peQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'peQuarterlyIncrease',
        'peQuarterlyDecrease',
        'peRatio',
      )

      const {
        increaseValue: revenueQuarterlyIncrease,
        decreaseValue: revenueQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'revenueQuarterlyIncrease',
        'revenueQuarterlyDecrease',
        'totalRevenue',
      )

      const {
        increaseValue: profitQuarterlyIncrease,
        decreaseValue: profitQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'profitQuarterlyIncrease',
        'profitQuarterlyDecrease',
        'grossProfit',
      )

      const {
        increaseValue: incomeQuarterlyIncrease,
        decreaseValue: incomeQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'incomeQuarterlyIncrease',
        'incomeQuarterlyDecrease',
        'netIncome',
      )

      const {
        increaseValue: epsQuarterlyIncrease,
        decreaseValue: epsQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'epsQuarterlyIncrease',
        'epsQuarterlyDecrease',
        'eps',
      )

      const {
        increaseValue: ebitdaQuarterlyIncrease,
        decreaseValue: ebitdaQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'ebitdaQuarterlyIncrease',
        'ebitdaQuarterlyDecrease',
        'ebitda',
      )

      const {
        increaseValue: equityQuarterlyIncrease,
        decreaseValue: equityQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'equityQuarterlyIncrease',
        'equityQuarterlyDecrease',
        'equity',
      )

      const {
        increaseValue: freeCashFlowQuarterlyIncrease,
        decreaseValue: freeCashFlowQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'freeCashFlowQuarterlyIncrease',
        'freeCashFlowQuarterlyDecrease',
        'freeCashFlow',
      )

      const {
        increaseValue: bookValueQuarterlyIncrease,
        decreaseValue: bookValueQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'bookValueQuarterlyIncrease',
        'bookValueQuarterlyDecrease',
        'bookValue',
      )

      const {
        increaseValue: roaQuarterlyIncrease,
        decreaseValue: roaQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'roaQuarterlyIncrease',
        'roaQuarterlyDecrease',
        'roa',
      )

      const {
        increaseValue: roeQuarterlyIncrease,
        decreaseValue: roeQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'roeQuarterlyIncrease',
        'roeQuarterlyDecrease',
        'roe',
      )

      const {
        increaseValue: grossMarginQuarterlyIncrease,
        decreaseValue: grossMarginQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'grossMarginQuarterlyIncrease',
        'grossMarginQuarterlyDecrease',
        'grossMargin',
      )

      const {
        increaseValue: debtEquityQuarterlyIncrease,
        decreaseValue: debtEquityQuarterlyDecrease,
      } = calcTool.calcTickerQuarterlyIncreaseDecreaseValues(
        tickerQuarterly,
        lastRecord,
        'debtEquityQuarterlyIncrease',
        'debtEquityQuarterlyDecrease',
        'debtEquity',
      )

      const movementValues = {
        roaQuarterlyIncrease,
        roaQuarterlyDecrease,
        roeQuarterlyIncrease,
        roeQuarterlyDecrease,
        grossMarginQuarterlyIncrease,
        grossMarginQuarterlyDecrease,
        debtEquityQuarterlyIncrease,
        debtEquityQuarterlyDecrease,
        revenueQuarterlyIncrease,
        revenueQuarterlyDecrease,
        profitQuarterlyIncrease,
        profitQuarterlyDecrease,
        incomeQuarterlyIncrease,
        incomeQuarterlyDecrease,
        epsQuarterlyIncrease,
        epsQuarterlyDecrease,
        ebitdaQuarterlyIncrease,
        ebitdaQuarterlyDecrease,
        bookValueQuarterlyIncrease,
        bookValueQuarterlyDecrease,
        equityQuarterlyIncrease,
        equityQuarterlyDecrease,
        freeCashFlowQuarterlyIncrease,
        freeCashFlowQuarterlyDecrease,
        peQuarterlyIncrease,
        peQuarterlyDecrease,
        pbQuarterlyIncrease,
        pbQuarterlyDecrease,
        psQuarterlyIncrease,
        psQuarterlyDecrease,
      }

      const hasUpdate =
        hasBaseUpdate ||
        constants.Ticker.QuarterlyMovementKeys.some((key) => tickerQuarterly[key] !== movementValues[key])
      if (hasUpdate) transactionUsed = true

      const quarterly = hasUpdate
        ? await tickerQuarterlyModel.update(tickerQuarterly.id, {
          bookValue: bookValue !== null ? String(bookValue) : null,
          peRatio,
          pbRatio,
          psRatio,
          grossMarginQoQ,
          debtEquityQoQ,
          ...movementValues,
        }, transaction)
        : tickerQuarterly

      checkedQuarterly.push(quarterly)
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

export const calcAllTickersQuarterlyFinancial = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerQuarterlyFinancial(ticker.id)
  })
}

const calcTickerYearlyFinancial = async (tickerId: number) => {
  console.info(`checking ${tickerId}`)
  const tickerYearlyRecords = await tickerYearlyModel.getAll(tickerId)
  if (!tickerYearlyRecords.length) return

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    const checkedYearly: interfaces.tickerYearlyModel.Record[] = []
    await runTool.asyncForEach(tickerYearlyRecords, async (
      tickerYearly: interfaces.tickerYearlyModel.Record,
    ) => {
      const lastRecord = checkedYearly.length ? checkedYearly[checkedYearly.length - 1] : null
      const priceRecord = await tickerDailyModel.getPreviousOne(tickerId, tickerYearly.earningDate)

      const bookValue = calcTool.calcBookValue(tickerYearly.totalAssets, tickerYearly.totalLiabilities)

      const closePrice = priceRecord ? priceRecord.closePrice / 100 : null
      const pbRatio = calcTool.calcPbRatio(closePrice, bookValue, tickerYearly.outstandingShares)
      const peRatio = calcTool.calcPeRatio(closePrice, tickerYearly.eps)
      const psRatio = calcTool.calcPsRatio(closePrice, tickerYearly.totalRevenue, tickerYearly.outstandingShares)

      const hasBaseUpdate =
        tickerYearly.bookValue !== bookValue ||
        tickerYearly.pbRatio !== pbRatio ||
        tickerYearly.peRatio !== peRatio ||
        tickerYearly.psRatio !== psRatio

      tickerYearly.bookValue = bookValue
      tickerYearly.pbRatio = pbRatio
      tickerYearly.peRatio = peRatio
      tickerYearly.psRatio = psRatio

      const {
        increaseValue: pbYearlyIncrease,
        decreaseValue: pbYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'pbYearlyIncrease',
        'pbYearlyDecrease',
        'pbRatio',
      )

      const {
        increaseValue: psYearlyIncrease,
        decreaseValue: psYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'psYearlyIncrease',
        'psYearlyDecrease',
        'psRatio',
      )

      const {
        increaseValue: peYearlyIncrease,
        decreaseValue: peYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'peYearlyIncrease',
        'peYearlyDecrease',
        'peRatio',
      )

      const {
        increaseValue: revenueYearlyIncrease,
        decreaseValue: revenueYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'revenueYearlyIncrease',
        'revenueYearlyDecrease',
        'totalRevenue',
      )

      const {
        increaseValue: profitYearlyIncrease,
        decreaseValue: profitYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'profitYearlyIncrease',
        'profitYearlyDecrease',
        'grossProfit',
      )

      const {
        increaseValue: incomeYearlyIncrease,
        decreaseValue: incomeYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'incomeYearlyIncrease',
        'incomeYearlyDecrease',
        'netIncome',
      )

      const {
        increaseValue: epsYearlyIncrease,
        decreaseValue: epsYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'epsYearlyIncrease',
        'epsYearlyDecrease',
        'eps',
      )

      const {
        increaseValue: ebitdaYearlyIncrease,
        decreaseValue: ebitdaYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'ebitdaYearlyIncrease',
        'ebitdaYearlyDecrease',
        'ebitda',
      )

      const {
        increaseValue: equityYearlyIncrease,
        decreaseValue: equityYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'equityYearlyIncrease',
        'equityYearlyDecrease',
        'equity',
      )

      const {
        increaseValue: freeCashFlowYearlyIncrease,
        decreaseValue: freeCashFlowYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'freeCashFlowYearlyIncrease',
        'freeCashFlowYearlyDecrease',
        'freeCashFlow',
      )

      const {
        increaseValue: bookValueYearlyIncrease,
        decreaseValue: bookValueYearlyDecrease,
      } = calcTool.calcTickerYearlyIncreaseDecreaseValues(
        tickerYearly,
        lastRecord,
        'bookValueYearlyIncrease',
        'bookValueYearlyDecrease',
        'bookValue',
      )

      const movementValues = {
        revenueYearlyIncrease,
        revenueYearlyDecrease,
        profitYearlyIncrease,
        profitYearlyDecrease,
        incomeYearlyIncrease,
        incomeYearlyDecrease,
        epsYearlyIncrease,
        epsYearlyDecrease,
        ebitdaYearlyIncrease,
        ebitdaYearlyDecrease,
        bookValueYearlyIncrease,
        bookValueYearlyDecrease,
        equityYearlyIncrease,
        equityYearlyDecrease,
        freeCashFlowYearlyIncrease,
        freeCashFlowYearlyDecrease,
        peYearlyIncrease,
        peYearlyDecrease,
        pbYearlyIncrease,
        pbYearlyDecrease,
        psYearlyIncrease,
        psYearlyDecrease,
      }

      const hasUpdate =
        hasBaseUpdate ||
        constants.Ticker.YearlyMovementKeys.some((key) => tickerYearly[key] !== movementValues[key])
      if (hasUpdate) transactionUsed = true

      const yearly = hasUpdate
        ? await tickerYearlyModel.update(tickerYearly.id, {
          bookValue: bookValue !== null ? String(bookValue) : null,
          peRatio,
          pbRatio,
          psRatio,
          ...movementValues,
        }, transaction)
        : tickerYearly

      checkedYearly.push(yearly)
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

export const calcAllTickersYearlyFinancial = async () => {
  const tickers = await tickerModel.getAll()
  await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerDailyModel.Record) => {
    await calcTickerYearlyFinancial(ticker.id)
  })
}

interface Quarterlys {
  [tickerId: number]: interfaces.tickerQuarterlyModel.Record;
}

interface Yearlys {
  [tickerId: number]: interfaces.tickerYearlyModel.Record;
}

export const buildTickerInfo = (
  tickerDaily: interfaces.tickerDailyModel.Record,
  tickerQuarterly: interfaces.tickerQuarterlyModel.Record | null,
  tickerYearly: interfaces.tickerYearlyModel.Record | null,
): interfaces.dailyTickersModel.TickerInfo => {
  const tickerInfo: interfaces.dailyTickersModel.TickerInfo = {
    priceDailyIncrease: tickerDaily.priceDailyIncrease,
    priceDailyDecrease: tickerDaily.priceDailyDecrease,
    priceWeeklyIncrease: tickerDaily.priceWeeklyIncrease,
    priceWeeklyDecrease: tickerDaily.priceWeeklyDecrease,
    priceMonthlyIncrease: tickerDaily.priceMonthlyIncrease,
    priceMonthlyDecrease: tickerDaily.priceMonthlyDecrease,
    priceQuarterlyIncrease: tickerDaily.priceQuarterlyIncrease,
    priceQuarterlyDecrease: tickerDaily.priceQuarterlyDecrease,
    priceYearlyIncrease: tickerDaily.priceYearlyIncrease,
    priceYearlyDecrease: tickerDaily.priceYearlyDecrease,
  }

  constants.Ticker.YearlyMovementKeys.forEach((key) => {
    if (tickerYearly?.[key] !== undefined && tickerYearly?.[key] !== null) {
      tickerInfo[key] = tickerYearly[key]
    }
  })

  constants.Ticker.QuarterlyMovementKeys.forEach((key) => {
    if (tickerQuarterly?.[key] !== undefined && tickerQuarterly?.[key] !== null) {
      tickerInfo[key] = tickerQuarterly[key]
    }
  })

  return tickerInfo
}

export const buildIndicatorInfo = (
  indicatorMonthly: interfaces.indicatorMonthlyModel.Record | null,
  indicatorQuarterly: interfaces.indicatorQuarterlyModel.Record | null,
  indicatorYearly: interfaces.indicatorYearlyModel.Record | null,
): interfaces.dailyTickersModel.IndicatorInfo => {
  return {
    inflationYearlyIncrease: indicatorYearly ? indicatorYearly.inflationYearlyIncrease : null,
    inflationYearlyDecrease: indicatorYearly ? indicatorYearly.inflationYearlyDecrease : null,
    gdpYearlyChangePercent: indicatorYearly ? indicatorYearly.gdpYearlyChangePercent : null,
    gdpQuarterlyChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyChangePercent : null,
    gdpQuarterlyYoYChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyYoYChangePercent : null,
    fundsRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyIncrease : null,
    fundsRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyDecrease : null,
    thirtyYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyIncrease : null,
    thirtyYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyDecrease : null,
    tenYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyIncrease : null,
    tenYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyDecrease : null,
    inflationMonthlyIncrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyIncrease : null,
    inflationMonthlyDecrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyDecrease : null,
    cpiMonthlyIncrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyIncrease : null,
    cpiMonthlyDecrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyDecrease : null,
    consumerSentimentMonthlyIncrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyIncrease : null,
    consumerSentimentMonthlyDecrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyDecrease : null,
    retailSalesMonthlyIncrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyIncrease : null,
    retailSalesMonthlyDecrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyDecrease : null,
    durableGoodsMonthlyIncrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyIncrease : null,
    durableGoodsMonthlyDecrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyDecrease : null,
    unemploymentRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.unemploymentRateMonthlyIncrease : null,
    unemploymentRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.unemploymentRateMonthlyDecrease : null,
    nonfarmPayrollMonthlyIncrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyIncrease : null,
    nonfarmPayrollMonthlyDecrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyDecrease : null,
  }
}

const buildDailyTickers = async (
  targetDate: string,
): Promise<interfaces.dailyTickersModel.DailyTickers | null> => {
  const dailyTargets = await tickerDailyModel.getByDate(targetDate)
  if (!dailyTargets.length) return null

  const quarterlyTargets = await tickerQuarterlyModel.getPublishedByDate(targetDate)
  const initialQuarterlys: Quarterlys = {}
  const quarterlys = quarterlyTargets.reduce((quarterlys, quarterly) => {
    quarterlys[quarterly.tickerId] = quarterly
    return quarterlys
  }, initialQuarterlys)

  const yearlyTargets = await tickerYearlyModel.getPublishedByDate(targetDate)
  const initialYearlys: Yearlys = {}
  const yearlys = yearlyTargets.reduce((yearlys, yearly) => {
    yearlys[yearly.tickerId] = yearly
    return yearlys
  }, initialYearlys)

  const initialDailyTickers: interfaces.dailyTickersModel.DailyTickers = {}
  return dailyTargets.reduce((tickers, daily) => {
    const quarterly = quarterlys[daily.tickerId] || null
    const yearly = yearlys[daily.tickerId] || null
    const info = buildTickerInfo(
      daily, quarterly, yearly,
    )
    tickers[daily.tickerId] = { info, daily, quarterly, yearly }
    return tickers
  }, initialDailyTickers)
}

const buildDailyIndicators = async (
  targetDate: string,
): Promise<interfaces.dailyTickersModel.IndicatorInfo> => {
  const monthlyIndicator = await indicatorMonthlyModel.getPublishedByDate(targetDate)
  const quarterlyIndicator = await indicatorQuarterlyModel.getPublishedByDate(targetDate)
  const yearlyIndicator = await indicatorYearlyModel.getPublishedByDate(targetDate)

  return buildIndicatorInfo(
    monthlyIndicator, quarterlyIndicator, yearlyIndicator,
  )
}

export const calcDailyAvailableTickers = async (
  forceRecheck: boolean,
  startDate?: string,
) => {
  const entityId = 1

  const lastPrices = await tickerDailyModel.getLatest(1)
  const lastPriceDate = lastPrices?.date || dateTool.getInitialDate()
  const lastCalculatedDate = forceRecheck
    ? dateTool.getInitialDate()
    : await dailyTickersModel.getLatestDate()

  const checkDate = startDate && startDate > lastCalculatedDate ? startDate : lastCalculatedDate

  let targetDate = dateTool.getNextDate(checkDate)
  if (!forceRecheck && lastPriceDate < targetDate) return

  while (targetDate <= lastPriceDate) {
    console.info(`Checking ${targetDate}`)
    const nextDate = dateTool.getNextDate(targetDate)

    const dailyTickers = await buildDailyTickers(targetDate)
    const indicators = dailyTickers ? await buildDailyIndicators(targetDate) : null
    const nearestPrices = await tickerDailyModel.getNearestPricesByDate(targetDate)

    const transaction = await databaseAdapter.createTransaction()
    try {
      await dailyTickersModel.upsert(entityId, targetDate, {
        tickers: dailyTickers,
        indicators,
        nearestPrices,
      }, transaction)
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }

    targetDate = nextDate
  }

  if (forceRecheck) {
    await cacheAdapter.empty()
    await cacheTask.generateSystemCaches()
  }
}
