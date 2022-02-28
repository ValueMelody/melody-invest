import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as runTool from '../tools/run'
import * as dateTool from '../tools/date'
import * as databaseAdapter from '../adapters/database'

export const calcYearly = async () => {
  const indicators = await indicatorYearlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicators, async (
      indicator: indicatorYearlyModel.Record, index: number,
    ) => {
      if (
        indicator.gdpYearlyChangePercent !== null &&
        indicator.inflationYearlyIncrease !== null &&
        indicator.inflationYearlyDecrease !== null
      ) return

      if (index === 0) return

      const lastIndicator = indicators[index - 1]
      const lastInflationIncrease = lastIndicator.inflationYearlyIncrease || 0
      const lastInflationDecrease = lastIndicator.inflationYearlyDecrease || 0
      const inflationIncrease = indicator.inflation! > lastIndicator.inflation!
        ? lastInflationIncrease + 1
        : 0
      const inflationDecrease = indicator.inflation! < lastIndicator.inflation!
        ? lastInflationDecrease + 1
        : 0
      const gdpChangePercent = (indicator.realGDP! - lastIndicator.realGDP!) * 100 / lastIndicator.realGDP!

      await indicatorYearlyModel.update(indicator.id, {
        inflationYearlyIncrease: inflationIncrease,
        inflationYearlyDecrease: inflationDecrease,
        gdpYearlyChangePercent: gdpChangePercent.toFixed(2),
      }, transaction)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcQuarterly = async () => {
  const indicators = await indicatorQuarterlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicators, async (
      indicator: indicatorQuarterlyModel.Record, index: number,
    ) => {
      if (
        indicator.gdpQuarterlyChangePercent !== null &&
        indicator.gdpQuarterlyYoYChangePercent !== null
      ) return

      if (index === 0) return

      const lastIndicator = indicators[index - 1]
      const changePercent = (indicator.realGDP! - lastIndicator.realGDP!) * 100 / lastIndicator.realGDP!

      const currentYear = indicator.quarter.substring(0, 4)
      const currentQuarter = indicator.quarter.substring(5, 7)
      const lastYear = dateTool.getPreviousYear(currentYear)
      const lastYoYQuarter = `${lastYear}-${currentQuarter}`
      const lastYoYIndicator = indicators.find((indicator) => indicator.quarter === lastYoYQuarter)

      const yoyChangePercent = lastYoYIndicator
        ? (indicator.realGDP! - lastYoYIndicator.realGDP!) * 100 / lastYoYIndicator.realGDP!
        : null

      await indicatorQuarterlyModel.update(indicator.id, {
        gdpQuarterlyChangePercent: changePercent.toFixed(2),
        gdpQuarterlyYoYChangePercent: yoyChangePercent?.toFixed(2),
      }, transaction)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcMonthly = async () => {
  const indicators = await indicatorMonthlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicators, async (indicator: indicatorMonthlyModel.Record) => {
      
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
