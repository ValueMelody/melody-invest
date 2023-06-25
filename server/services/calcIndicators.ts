import * as calcTool from 'tools/calc'
import * as dailyIndicatorModel from 'models/dailyIndicators'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as indicatorMonthlyModel from 'models/indicatorMonthly'
import * as indicatorQuarterlyModel from 'models/indicatorQuarterly'
import * as indicatorYearlyModel from 'models/indicatorYearly'
import * as interfaces from '@shared/interfaces'
import * as runTool from 'tools/run'

export const calcYearly = async () => {
  const indicators = await indicatorYearlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    const checkedYearly: interfaces.indicatorYearlyModel.Record[] = []
    await runTool.asyncForEach(indicators, async (
      indicator: interfaces.indicatorYearlyModel.Record,
    ) => {
      const lastIndicator = checkedYearly[checkedYearly.length - 1]

      const {
        increaseValue: inflationIncrease,
        decreaseValue: inflationDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.annualInflation,
        lastIndicator?.annualInflation,
        lastIndicator?.inflationYearlyIncrease,
        lastIndicator?.inflationYearlyDecrease,
      )

      const {
        increaseValue: gdpIncrease,
        decreaseValue: gdpDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.gdp,
        lastIndicator?.gdp,
        lastIndicator?.gdpYearlyIncrease,
        lastIndicator?.gdpYearlyDecrease,
      )

      const gdpChangePercent = calcTool.calcChangePercent(indicator.gdp, lastIndicator?.gdp)

      const hasUpdate =
        inflationIncrease !== indicator.inflationYearlyIncrease ||
        inflationDecrease !== indicator.inflationYearlyDecrease ||
        gdpIncrease !== indicator.gdpYearlyIncrease ||
        gdpDecrease !== indicator.gdpYearlyDecrease ||
        gdpChangePercent?.toFixed(2) !== indicator.gdpYearlyChangePercent?.toFixed(2)

      let updatedYearly = indicator
      if (hasUpdate) {
        transactionUsed = true
        updatedYearly = await indicatorYearlyModel.update(indicator.id, {
          inflationYearlyIncrease: inflationIncrease,
          inflationYearlyDecrease: inflationDecrease,
          gdpYearlyIncrease: gdpIncrease,
          gdpYearlyDecrease: gdpDecrease,
          gdpYearlyChangePercent: gdpChangePercent !== null ? gdpChangePercent.toFixed(2) : null,
        }, transaction)
      }

      checkedYearly.push(updatedYearly)
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

export const calcQuarterly = async () => {
  const indicators = await indicatorQuarterlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    const checkedQuarterly: interfaces.indicatorQuarterlyModel.Record[] = []
    await runTool.asyncForEach(indicators, async (
      indicator: interfaces.indicatorQuarterlyModel.Record, index: number,
    ) => {
      const lastIndicator = checkedQuarterly[checkedQuarterly.length - 1]

      const {
        increaseValue: gdpIncrease,
        decreaseValue: gdpDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.seasonalGDP,
        lastIndicator?.seasonalGDP,
        lastIndicator?.seasonalGDPQuarterlyIncrease,
        lastIndicator?.seasonalGDPQuarterlyDecrease,
      )

      const changePercent = calcTool.calcChangePercent(indicator.seasonalGDP, lastIndicator?.seasonalGDP)

      const currentYear = indicator.quarter.substring(0, 4)
      const currentQuarter = indicator.quarter.substring(5, 7)
      const lastYear = dateTool.getPreviousYear(currentYear)
      const lastYoYQuarter = `${lastYear}-${currentQuarter}`
      const lastYoYIndicator = checkedQuarterly.find((indicator) => indicator.quarter === lastYoYQuarter)
      const yoyChangePercent = calcTool.calcChangePercent(indicator.seasonalGDP, lastYoYIndicator?.seasonalGDP)

      const hasUpdate =
        changePercent?.toFixed(2) !== indicator.seasonalGDPQoQ?.toFixed(2) ||
        yoyChangePercent?.toFixed(2) !== indicator.seasonalGDPYoY?.toFixed(2) ||
        gdpIncrease !== indicator.seasonalGDPQuarterlyIncrease ||
        gdpDecrease !== indicator.seasonalGDPQuarterlyDecrease

      let updatedQuarterly = indicator
      if (hasUpdate) {
        transactionUsed = true
        updatedQuarterly = await indicatorQuarterlyModel.update(indicator.id, {
          seasonalGDPQoQ: changePercent ? changePercent.toFixed(2) : null,
          seasonalGDPYoY: yoyChangePercent ? yoyChangePercent.toFixed(2) : null,
          seasonalGDPQuarterlyIncrease: gdpIncrease,
          seasonalGDPQuarterlyDecrease: gdpDecrease,
        }, transaction)
      }

      checkedQuarterly.push(updatedQuarterly)
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

export const calcMonthly = async () => {
  const indicators = await indicatorMonthlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  let transactionUsed = false
  try {
    const checkedMonthly: interfaces.indicatorMonthlyModel.Record[] = []
    await runTool.asyncForEach(indicators, async (
      indicator: interfaces.indicatorMonthlyModel.Record,
    ) => {
      const lastIndicator = checkedMonthly[checkedMonthly.length - 1]

      const {
        increaseValue: fundsRateIncrease,
        decreaseValue: fundsRateDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.fundsRate,
        lastIndicator?.fundsRate,
        lastIndicator?.fundsRateMonthlyIncrease,
        lastIndicator?.fundsRateMonthlyDecrease,
      )

      const {
        increaseValue: thirtyYearsTreasuryIncrease,
        decreaseValue: thirtyYearsTreasuryDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.thirtyYearsTreasury,
        lastIndicator?.thirtyYearsTreasury,
        lastIndicator?.thirtyYearsTreasuryMonthlyIncrease,
        lastIndicator?.thirtyYearsTreasuryMonthlyDecrease,
      )

      const {
        increaseValue: tenYearsTreasuryIncrease,
        decreaseValue: tenYearsTreasuryDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.tenYearsTreasury,
        lastIndicator?.tenYearsTreasury,
        lastIndicator?.tenYearsTreasuryMonthlyIncrease,
        lastIndicator?.tenYearsTreasuryMonthlyDecrease,
      )

      const {
        increaseValue: inflationIncrease,
        decreaseValue: inflationDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.inflation,
        lastIndicator?.inflation,
        lastIndicator?.inflationMonthlyIncrease,
        lastIndicator?.inflationMonthlyDecrease,
      )

      const {
        increaseValue: cpiIncrease,
        decreaseValue: cpiDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.cpi,
        lastIndicator?.cpi,
        lastIndicator?.cpiMonthlyIncrease,
        lastIndicator?.cpiMonthlyDecrease,
      )

      const {
        increaseValue: consumerSentimentIncrease,
        decreaseValue: consumerSentimentDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.consumerSentiment,
        lastIndicator?.consumerSentiment,
        lastIndicator?.consumerSentimentMonthlyIncrease,
        lastIndicator?.consumerSentimentMonthlyDecrease,
      )

      const {
        increaseValue: unemploymentRateIncrease,
        decreaseValue: unemploymentRateDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.unemploymentRate,
        lastIndicator?.unemploymentRate,
        lastIndicator?.unemploymentRateMonthlyIncrease,
        lastIndicator?.unemploymentRateMonthlyDecrease,
      )

      const {
        increaseValue: nofarmPayrollIncrease,
        decreaseValue: nofarmPayrollDecrease,
      } = calcTool.calcIncreaseDecreaseValues(
        indicator.nonfarmPayroll,
        lastIndicator?.nonfarmPayroll,
        lastIndicator?.nonfarmPayrollMonthlyIncrease,
        lastIndicator?.nonfarmPayrollMonthlyDecrease,
      )

      const hasUpdate =
        fundsRateIncrease !== indicator.fundsRateMonthlyIncrease ||
        fundsRateDecrease !== indicator.fundsRateMonthlyDecrease ||
        thirtyYearsTreasuryIncrease !== indicator.thirtyYearsTreasuryMonthlyIncrease ||
        thirtyYearsTreasuryDecrease !== indicator.thirtyYearsTreasuryMonthlyDecrease ||
        tenYearsTreasuryIncrease !== indicator.tenYearsTreasuryMonthlyIncrease ||
        tenYearsTreasuryDecrease !== indicator.tenYearsTreasuryMonthlyDecrease ||
        inflationIncrease !== indicator.inflationMonthlyIncrease ||
        inflationDecrease !== indicator.inflationMonthlyDecrease ||
        cpiIncrease !== indicator.cpiMonthlyIncrease ||
        cpiDecrease !== indicator.cpiMonthlyDecrease ||
        consumerSentimentIncrease !== indicator.consumerSentimentMonthlyIncrease ||
        consumerSentimentDecrease !== indicator.consumerSentimentMonthlyDecrease ||
        unemploymentRateIncrease !== indicator.unemploymentRateMonthlyIncrease ||
        unemploymentRateDecrease !== indicator.unemploymentRateMonthlyDecrease ||
        nofarmPayrollIncrease !== indicator.nonfarmPayrollMonthlyIncrease ||
        nofarmPayrollDecrease !== indicator.nonfarmPayrollMonthlyDecrease

      let updatedIndicator = indicator
      if (hasUpdate) {
        transactionUsed = true
        updatedIndicator = await indicatorMonthlyModel.update(indicator.id, {
          fundsRateMonthlyIncrease: fundsRateIncrease,
          fundsRateMonthlyDecrease: fundsRateDecrease,
          thirtyYearsTreasuryMonthlyIncrease: thirtyYearsTreasuryIncrease,
          thirtyYearsTreasuryMonthlyDecrease: thirtyYearsTreasuryDecrease,
          tenYearsTreasuryMonthlyIncrease: tenYearsTreasuryIncrease,
          tenYearsTreasuryMonthlyDecrease: tenYearsTreasuryDecrease,
          inflationMonthlyIncrease: inflationIncrease,
          inflationMonthlyDecrease: inflationDecrease,
          cpiMonthlyIncrease: cpiIncrease,
          cpiMonthlyDecrease: cpiDecrease,
          consumerSentimentMonthlyIncrease: consumerSentimentIncrease,
          consumerSentimentMonthlyDecrease: consumerSentimentDecrease,
          unemploymentRateMonthlyIncrease: unemploymentRateIncrease,
          unemploymentRateMonthlyDecrease: unemploymentRateDecrease,
          nonfarmPayrollMonthlyIncrease: nofarmPayrollIncrease,
          nonfarmPayrollMonthlyDecrease: nofarmPayrollDecrease,
        }, transaction)
      }
      checkedMonthly.push(updatedIndicator)
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

export const calcDailyIndicators = async (checkAll: boolean = false) => {
  const today = dateTool.getCurrentDate()
  // Always double check latest 60 days
  const startDate = checkAll ? dateTool.getInitialDate() : dateTool.getPreviousDate(today, 60)
  let targetDate = startDate
  while (targetDate <= today) {
    console.info(`Checking ${targetDate}`)
    const nextDate = dateTool.getNextDate(targetDate)

    const monthlyIndicator = await indicatorMonthlyModel.getPublishedByDate(targetDate)
    const quarterlyIndicator = await indicatorQuarterlyModel.getPublishedByDate(targetDate)
    const yearlyIndicator = await indicatorYearlyModel.getPublishedByDate(targetDate)

    const indicatorInfo = calcTool.calcIndicatorInfo(monthlyIndicator, quarterlyIndicator, yearlyIndicator)

    const transaction = await databaseAdapter.createTransaction()
    try {
      await dailyIndicatorModel.upsert(targetDate, {
        indicatorInfo,
      }, transaction)
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }

    targetDate = nextDate
  }
}
