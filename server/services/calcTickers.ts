import * as calcTool from 'tools/calc'
import * as constants from '@shared/constants'
import * as dailyTickersModel from 'models/dailyTickers'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as entityModel from 'models/entity'
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
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.pbRatio ? parseFloat(tickerQuarterly.pbRatio) : null,
        lastRecord?.pbRatio ? parseFloat(lastRecord.pbRatio) : null,
        lastRecord?.pbQuarterlyIncrease,
        lastRecord?.pbQuarterlyDecrease,
      )

      const {
        increaseValue: psQuarterlyIncrease,
        decreaseValue: psQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.psRatio ? parseFloat(tickerQuarterly.psRatio) : null,
        lastRecord?.psRatio ? parseFloat(lastRecord.psRatio) : null,
        lastRecord?.psQuarterlyIncrease,
        lastRecord?.psQuarterlyDecrease,
      )

      const {
        increaseValue: peQuarterlyIncrease,
        decreaseValue: peQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.peRatio ? parseFloat(tickerQuarterly.peRatio) : null,
        lastRecord?.peRatio ? parseFloat(lastRecord.peRatio) : null,
        lastRecord?.peQuarterlyIncrease,
        lastRecord?.peQuarterlyDecrease,
      )

      const {
        increaseValue: revenueQuarterlyIncrease,
        decreaseValue: revenueQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.totalRevenue,
        lastRecord?.totalRevenue,
        lastRecord?.revenueQuarterlyIncrease,
        lastRecord?.revenueQuarterlyDecrease,
      )

      const {
        increaseValue: profitQuarterlyIncrease,
        decreaseValue: profitQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.grossProfit,
        lastRecord?.grossProfit,
        lastRecord?.profitQuarterlyIncrease,
        lastRecord?.profitQuarterlyDecrease,
      )

      const {
        increaseValue: incomeQuarterlyIncrease,
        decreaseValue: incomeQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.netIncome,
        lastRecord?.netIncome,
        lastRecord?.incomeQuarterlyIncrease,
        lastRecord?.incomeQuarterlyDecrease,
      )

      const {
        increaseValue: epsQuarterlyIncrease,
        decreaseValue: epsQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.eps,
        lastRecord?.eps,
        lastRecord?.epsQuarterlyIncrease,
        lastRecord?.epsQuarterlyDecrease,
      )

      const {
        increaseValue: ebitdaQuarterlyIncrease,
        decreaseValue: ebitdaQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.ebitda,
        lastRecord?.ebitda,
        lastRecord?.ebitdaQuarterlyIncrease,
        lastRecord?.ebitdaQuarterlyDecrease,
      )

      const {
        increaseValue: equityQuarterlyIncrease,
        decreaseValue: equityQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.equity,
        lastRecord?.equity,
        lastRecord?.equityQuarterlyIncrease,
        lastRecord?.equityQuarterlyDecrease,
      )

      const {
        increaseValue: freeCashFlowQuarterlyIncrease,
        decreaseValue: freeCashFlowQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.freeCashFlow,
        lastRecord?.freeCashFlow,
        lastRecord?.freeCashFlowQuarterlyIncrease,
        lastRecord?.freeCashFlowQuarterlyDecrease,
      )

      const {
        increaseValue: bookValueQuarterlyIncrease,
        decreaseValue: bookValueQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.bookValue,
        lastRecord?.bookValue,
        lastRecord?.bookValueQuarterlyIncrease,
        lastRecord?.bookValueQuarterlyDecrease,
      )

      const {
        increaseValue: roaQuarterlyIncrease,
        decreaseValue: roaQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.roa,
        lastRecord?.roa,
        lastRecord?.roaQuarterlyIncrease,
        lastRecord?.roaQuarterlyDecrease,
      )

      const {
        increaseValue: roeQuarterlyIncrease,
        decreaseValue: roeQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.roe,
        lastRecord?.roe,
        lastRecord?.roeQuarterlyIncrease,
        lastRecord?.roeQuarterlyDecrease,
      )

      const {
        increaseValue: grossMarginQuarterlyIncrease,
        decreaseValue: grossMarginQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.grossMargin,
        lastRecord?.grossMargin,
        lastRecord?.grossMarginQuarterlyIncrease,
        lastRecord?.grossMarginQuarterlyDecrease,
      )

      const {
        increaseValue: debtEquityQuarterlyIncrease,
        decreaseValue: debtEquityQuarterlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerQuarterly.debtEquity,
        lastRecord?.debtEquity,
        lastRecord?.debtEquityQuarterlyIncrease,
        lastRecord?.debtEquityQuarterlyDecrease,
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
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.pbRatio ? parseFloat(tickerYearly.pbRatio) : null,
        lastRecord?.pbRatio ? parseFloat(lastRecord.pbRatio) : null,
        lastRecord?.pbYearlyIncrease,
        lastRecord?.pbYearlyDecrease,
      )

      const {
        increaseValue: psYearlyIncrease,
        decreaseValue: psYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.psRatio ? parseFloat(tickerYearly.psRatio) : null,
        lastRecord?.psRatio ? parseFloat(lastRecord.psRatio) : null,
        lastRecord?.psYearlyIncrease,
        lastRecord?.psYearlyDecrease,
      )

      const {
        increaseValue: peYearlyIncrease,
        decreaseValue: peYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.peRatio ? parseFloat(tickerYearly.peRatio) : null,
        lastRecord?.peRatio ? parseFloat(lastRecord.peRatio) : null,
        lastRecord?.peYearlyIncrease,
        lastRecord?.peYearlyDecrease,
      )

      const {
        increaseValue: revenueYearlyIncrease,
        decreaseValue: revenueYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.totalRevenue,
        lastRecord?.totalRevenue,
        lastRecord?.revenueYearlyIncrease,
        lastRecord?.revenueYearlyDecrease,
      )

      const {
        increaseValue: profitYearlyIncrease,
        decreaseValue: profitYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.grossProfit,
        lastRecord?.grossProfit,
        lastRecord?.profitYearlyIncrease,
        lastRecord?.profitYearlyDecrease,
      )

      const {
        increaseValue: incomeYearlyIncrease,
        decreaseValue: incomeYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.netIncome,
        lastRecord?.netIncome,
        lastRecord?.incomeYearlyIncrease,
        lastRecord?.incomeYearlyDecrease,
      )

      const {
        increaseValue: epsYearlyIncrease,
        decreaseValue: epsYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.eps,
        lastRecord?.eps,
        lastRecord?.epsYearlyIncrease,
        lastRecord?.epsYearlyDecrease,
      )

      const {
        increaseValue: ebitdaYearlyIncrease,
        decreaseValue: ebitdaYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.ebitda,
        lastRecord?.ebitda,
        lastRecord?.ebitdaYearlyIncrease,
        lastRecord?.ebitdaYearlyDecrease,
      )

      const {
        increaseValue: equityYearlyIncrease,
        decreaseValue: equityYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.equity,
        lastRecord?.equity,
        lastRecord?.equityYearlyIncrease,
        lastRecord?.equityYearlyDecrease,
      )

      const {
        increaseValue: freeCashFlowYearlyIncrease,
        decreaseValue: freeCashFlowYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.freeCashFlow,
        lastRecord?.freeCashFlow,
        lastRecord?.freeCashFlowYearlyIncrease,
        lastRecord?.freeCashFlowYearlyDecrease,
      )

      const {
        increaseValue: bookValueYearlyIncrease,
        decreaseValue: bookValueYearlyDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        tickerYearly.bookValue,
        lastRecord?.bookValue,
        lastRecord?.bookValueYearlyIncrease,
        lastRecord?.bookValueYearlyDecrease,
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

export const groupTickerInfo = (
  tickerDaily: interfaces.tickerDailyModel.Record,
  tickerQuarterly: interfaces.tickerQuarterlyModel.Record | null,
  tickerYearly: interfaces.tickerYearlyModel.Record | null,
): interfaces.dailyTickersModel.TickerInfo => {
  const info = {} as interfaces.dailyTickersModel.TickerInfo

  constants.Ticker.DailyMovementKeys.forEach((key) => {
    if (tickerDaily[key] !== undefined && tickerDaily[key] !== null) {
      info[key] = tickerDaily[key]
    }
  })

  constants.Ticker.QuarterlyCompareKeys.forEach((key) => {
    if (tickerQuarterly?.[key] !== undefined && tickerQuarterly?.[key] !== null) {
      info[key] = tickerQuarterly[key]
    }
  })

  constants.Ticker.QuarterlyMovementKeys.forEach((key) => {
    if (tickerQuarterly?.[key] !== undefined && tickerQuarterly?.[key] !== null) {
      info[key] = tickerQuarterly[key]
    }
  })

  constants.Ticker.YearlyCompareKeys.forEach((key) => {
    if (key === 'annualPeRatio') info[key] = tickerYearly?.peRatio
    if (key === 'annualPbRatio') info[key] = tickerYearly?.pbRatio
    if (key === 'annualPsRatio') info[key] = tickerYearly?.psRatio
    // @ts-ignore
    if (tickerYearly?.[key] !== undefined && tickerYearly?.[key] !== null) {
      // @ts-ignore
      info[key] = tickerYearly[key]
    }
  })

  constants.Ticker.YearlyMovementKeys.forEach((key) => {
    if (tickerYearly?.[key] !== undefined && tickerYearly?.[key] !== null) {
      info[key] = tickerYearly[key]
    }
  })

  return info
}

const buildTickerInfos = async (
  targetDate: string,
  tickerIds: number[],
): Promise<interfaces.dailyTickersModel.TickerInfos | null> => {
  const dailyTargets = await tickerDailyModel.getByDate(targetDate, tickerIds)
  if (!dailyTargets.length) return null

  const quarterlyTargets = await tickerQuarterlyModel.getPublishedByDate(targetDate, tickerIds)
  const quarterlys = quarterlyTargets.reduce((quarterlys, quarterly) => {
    if (quarterlys[quarterly.tickerId]) return quarterlys
    quarterlys[quarterly.tickerId] = quarterly
    return quarterlys
  }, {} as {
    [tickerId: number]: interfaces.tickerQuarterlyModel.Record;
  })

  const yearlyTargets = await tickerYearlyModel.getPublishedByDate(targetDate, tickerIds)
  const yearlys = yearlyTargets.reduce((yearlys, yearly) => {
    if (yearlys[yearly.tickerId]) return yearlys
    yearlys[yearly.tickerId] = yearly
    return yearlys
  }, {} as {
    [tickerId: number]: interfaces.tickerYearlyModel.Record;
  })

  return dailyTargets.reduce((tickers, daily) => {
    const quarterly = quarterlys[daily.tickerId] || null
    const yearly = yearlys[daily.tickerId] || null
    const info = groupTickerInfo(
      daily, quarterly, yearly,
    )
    tickers[daily.tickerId] = info
    return tickers
  }, {} as interfaces.dailyTickersModel.TickerInfos)
}

export const calcDailyTickers = async () => {
  const lastPrice = await tickerDailyModel.getLatest()
  const lastPriceDate = lastPrice?.date || dateTool.getInitialDate()

  const entities = await entityModel.getAll()
  await runTool.asyncForEach(entities, async (entity: interfaces.entityModel.Record) => {
    const tickers = await tickerModel.getAllByEntity(entity.id)
    if (!tickers.length) return
    const tickerIds = tickers.map((ticker) => ticker.id)

    console.info(`checking entity: ${entity.id}`)
    const lastRecord = await dailyTickersModel.getLast(entity.id)
    // Always double check latest 60 days
    let targetDate = lastRecord && Object.keys(lastRecord.priceInfo).length === tickerIds.length
      ? dateTool.getPreviousDate(lastRecord.date, 60)
      : dateTool.getInitialDate()

    while (targetDate <= lastPriceDate) {
      const nextDate = dateTool.getNextDate(targetDate)
      const priceInfo = await tickerDailyModel.getPriceInfoByDate(targetDate, tickerIds)
      const tickerInfos = await buildTickerInfos(targetDate, tickerIds)

      const transaction = await databaseAdapter.createTransaction()
      try {
        await dailyTickersModel.upsert(entity.id, targetDate, {
          tickerInfos,
          priceInfo,
        }, transaction)
        await transaction.commit()
      } catch (error) {
        await transaction.rollback()
        throw error
      }
      targetDate = nextDate
    }
  })
}
