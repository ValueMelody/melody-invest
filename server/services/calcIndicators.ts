import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as runTool from '../tools/run'
import * as databaseAdapter from '../adapters/database'

export const calcYearly = async () => {
  const indicators = await indicatorYearlyModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(indicators, async (
      indicator: indicatorYearlyModel.Record, index: number,
    ) => {
      if (
        indicator.gdpChangePercent !== null &&
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
        gdpChangePercent: gdpChangePercent.toFixed(2),
      }, transaction)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
