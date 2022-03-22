import * as interfaces from '@shared/interfaces'
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
    const checkedYearly: interfaces.indicatorYearlyModel.Record[] = []
    await runTool.asyncForEach(indicators, async (
      indicator: interfaces.indicatorYearlyModel.Record,
    ) => {
      const hasValidValues = indicator.inflationYearlyIncrease !== null &&
        indicator.inflationYearlyDecrease !== null &&
        indicator.gdpYearlyChangePercent !== null

      if (hasValidValues || !checkedYearly.length) {
        checkedYearly.push(indicator)
        return
      }

      const lastIndicator = checkedYearly[checkedYearly.length - 1]

      let inflationIncrease = indicator.inflationYearlyIncrease
      let inflationDecrease = indicator.inflationYearlyDecrease
      if (indicator.inflation !== null && lastIndicator.inflation !== null) {
        const lastInflationIncrease = lastIndicator.inflationYearlyIncrease || 0
        inflationIncrease = indicator.inflation > lastIndicator.inflation ? lastInflationIncrease + 1 : 0
        const lastInflationDecrease = lastIndicator.inflationYearlyDecrease || 0
        inflationDecrease = indicator.inflation < lastIndicator.inflation ? lastInflationDecrease + 1 : 0
      }

      let gdpChangePercent = indicator.gdpYearlyChangePercent
      if (indicator.realGDP !== null && lastIndicator.realGDP !== null) {
        gdpChangePercent = (indicator.realGDP - lastIndicator.realGDP) * 100 / lastIndicator.realGDP
      }

      const hasUpdate = inflationIncrease !== indicator.inflationYearlyIncrease ||
        inflationDecrease !== indicator.inflationYearlyDecrease ||
        gdpChangePercent !== indicator.gdpYearlyChangePercent

      let updatedYearly = indicator
      if (hasUpdate) {
        updatedYearly = await indicatorYearlyModel.update(indicator.id, {
          inflationYearlyIncrease: inflationIncrease,
          inflationYearlyDecrease: inflationDecrease,
          gdpYearlyChangePercent: gdpChangePercent ? gdpChangePercent.toFixed(2) : null,
        }, transaction)
      }

      checkedYearly.push(updatedYearly)
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
      indicator: interfaces.indicatorQuarterlyModel.Record, index: number,
    ) => {
      if (
        indicator.gdpQuarterlyChangePercent !== null &&
        indicator.gdpQuarterlyYoYChangePercent !== null
      ) return

      if (index === 0) return

      const lastIndicator = indicators[index - 1]

      let changePercent = indicator.gdpQuarterlyChangePercent
      if (indicator.realGDP && lastIndicator.realGDP) {
        changePercent = (indicator.realGDP - lastIndicator.realGDP) * 100 / lastIndicator.realGDP
      }

      let yoyChangePercent = indicator.gdpQuarterlyYoYChangePercent
      const currentYear = indicator.quarter.substring(0, 4)
      const currentQuarter = indicator.quarter.substring(5, 7)
      const lastYear = dateTool.getPreviousYear(currentYear)
      const lastYoYQuarter = `${lastYear}-${currentQuarter}`
      const lastYoYIndicator = indicators.find((indicator) => indicator.quarter === lastYoYQuarter)
      if (indicator.realGDP && lastYoYIndicator?.realGDP) {
        yoyChangePercent = (indicator.realGDP - lastYoYIndicator.realGDP) * 100 / lastYoYIndicator.realGDP
      }

      const hasUpdate = changePercent !== indicator.gdpQuarterlyChangePercent ||
        yoyChangePercent !== indicator.gdpQuarterlyYoYChangePercent

      if (hasUpdate) {
        await indicatorQuarterlyModel.update(indicator.id, {
          gdpQuarterlyChangePercent: changePercent ? changePercent.toFixed(2) : null,
          gdpQuarterlyYoYChangePercent: yoyChangePercent ? yoyChangePercent.toFixed(2) : null,
        }, transaction)
      }
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
    const checkedMonthly: interfaces.indicatorMonthlyModel.Record[] = []
    await runTool.asyncForEach(indicators, async (
      indicator: interfaces.indicatorMonthlyModel.Record,
    ) => {
      const hasValidValues = indicator.fundsRateMonthlyIncrease !== null &&
        indicator.fundsRateMonthlyDecrease !== null &&
        indicator.thirtyYearsTreasuryMonthlyIncrease !== null &&
        indicator.thirtyYearsTreasuryMonthlyDecrease !== null &&
        indicator.tenYearsTreasuryMonthlyIncrease !== null &&
        indicator.tenYearsTreasuryMonthlyDecrease !== null &&
        indicator.inflationMonthlyIncrease !== null &&
        indicator.inflationMonthlyDecrease !== null &&
        indicator.cpiMonthlyIncrease !== null &&
        indicator.cpiMonthlyDecrease !== null &&
        indicator.consumerSentimentMonthlyIncrease !== null &&
        indicator.consumerSentimentMonthlyDecrease !== null &&
        indicator.retailSalesMonthlyIncrease !== null &&
        indicator.retailSalesMonthlyDecrease !== null &&
        indicator.durableGoodsMonthlyIncrease !== null &&
        indicator.durableGoodsMonthlyDecrease !== null &&
        indicator.unemploymentRateMonthlyIncrease !== null &&
        indicator.unemploymentRateMonthlyDecrease !== null &&
        indicator.nonfarmPayrollMonthlyIncrease !== null &&
        indicator.nonfarmPayrollMonthlyDecrease !== null

      if (hasValidValues || !checkedMonthly.length) {
        checkedMonthly.push(indicator)
      }

      const lastIndicator = checkedMonthly[checkedMonthly.length - 1]

      let fundsRateIncrease = indicator.fundsRateMonthlyIncrease
      let fundsRateDecrease = indicator.fundsRateMonthlyDecrease
      if (indicator.fundsRate && lastIndicator.fundsRate) {
        const lastFundsRateIncrease = lastIndicator.fundsRateMonthlyIncrease || 0
        fundsRateIncrease = indicator.fundsRate > lastIndicator.fundsRate ? lastFundsRateIncrease + 1 : 0
        const lastFundsRateDecrease = lastIndicator.fundsRateMonthlyDecrease || 0
        fundsRateDecrease = indicator.fundsRate < lastIndicator.fundsRate ? lastFundsRateDecrease + 1 : 0
      }

      let thirtyYearsTreasuryIncrease = indicator.thirtyYearsTreasuryMonthlyIncrease
      let thirtyYearsTreasuryDecrease = indicator.thirtyYearsTreasuryMonthlyDecrease
      if (indicator.thirtyYearsTreasury && lastIndicator.thirtyYearsTreasury) {
        const lastThirtyYearsTreasuryIncrease = lastIndicator.thirtyYearsTreasuryMonthlyIncrease || 0
        thirtyYearsTreasuryIncrease = indicator.thirtyYearsTreasury > lastIndicator.thirtyYearsTreasury ? lastThirtyYearsTreasuryIncrease + 1 : 0
        const lastThirtyYearsTreasuryDecrease = lastIndicator.thirtyYearsTreasuryMonthlyDecrease || 0
        thirtyYearsTreasuryDecrease = indicator.thirtyYearsTreasury < lastIndicator.thirtyYearsTreasury ? lastThirtyYearsTreasuryDecrease + 1 : 0
      }

      let tenYearsTreasuryIncrease = indicator.tenYearsTreasuryMonthlyIncrease
      let tenYearsTreasuryDecrease = indicator.tenYearsTreasuryMonthlyDecrease
      if (indicator.tenYearsTreasury && lastIndicator.tenYearsTreasury) {
        const lastTenYearsTreasuryIncrease = lastIndicator.tenYearsTreasuryMonthlyIncrease || 0
        tenYearsTreasuryIncrease = indicator.tenYearsTreasury > lastIndicator.tenYearsTreasury ? lastTenYearsTreasuryIncrease + 1 : 0
        const lastTenYearsTreasuryDecrease = lastIndicator.tenYearsTreasuryMonthlyDecrease || 0
        tenYearsTreasuryDecrease = indicator.tenYearsTreasury < lastIndicator.tenYearsTreasury ? lastTenYearsTreasuryDecrease + 1 : 0
      }

      let inflationIncrease = indicator.inflationMonthlyIncrease
      let inflationDecrease = indicator.inflationMonthlyDecrease
      if (indicator.inflationExpectation && lastIndicator.inflationExpectation) {
        const lastInflationIncrease = lastIndicator.inflationMonthlyIncrease || 0
        inflationIncrease = indicator.inflationExpectation > lastIndicator.inflationExpectation ? lastInflationIncrease + 1 : 0
        const lastInflationDecrease = lastIndicator.tenYearsTreasuryMonthlyDecrease || 0
        inflationDecrease = indicator.inflationExpectation < lastIndicator.inflationExpectation ? lastInflationDecrease + 1 : 0
      }

      let cpiIncrease = indicator.cpiMonthlyIncrease
      let cpiDecrease = indicator.cpiMonthlyDecrease
      if (indicator.cpi && lastIndicator.cpi) {
        const lastCPIIncrease = lastIndicator.cpiMonthlyIncrease || 0
        cpiIncrease = indicator.cpi > lastIndicator.cpi ? lastCPIIncrease + 1 : 0
        const lastCPIDecrease = lastIndicator.cpiMonthlyDecrease || 0
        cpiDecrease = indicator.cpi < lastIndicator.cpi ? lastCPIDecrease + 1 : 0
      }

      let consumerSentimentIncrease = indicator.consumerSentimentMonthlyIncrease
      let consumerSentimentDecrease = indicator.consumerSentimentMonthlyDecrease
      if (indicator.consumerSentiment && lastIndicator.consumerSentiment) {
        const lastConsumerSentimentIncrease = lastIndicator.consumerSentimentMonthlyIncrease || 0
        consumerSentimentIncrease = indicator.consumerSentiment > lastIndicator.consumerSentiment ? lastConsumerSentimentIncrease + 1 : 0
        const lastConsumerSentimentDecrease = lastIndicator.consumerSentimentMonthlyDecrease || 0
        consumerSentimentDecrease = indicator.consumerSentiment < lastIndicator.consumerSentiment ? lastConsumerSentimentDecrease + 1 : 0
      }

      let retailSalesIncrease = indicator.retailSalesMonthlyIncrease
      let retailSalesDecrease = indicator.retailSalesMonthlyDecrease
      if (indicator.retailSales && lastIndicator.retailSales) {
        const lastRetailSalesIncrease = lastIndicator.retailSalesMonthlyIncrease || 0
        retailSalesIncrease = indicator.retailSales > lastIndicator.retailSales ? lastRetailSalesIncrease + 1 : 0
        const lastRetailSalesDecrease = lastIndicator.retailSalesMonthlyDecrease || 0
        retailSalesDecrease = indicator.retailSales < lastIndicator.retailSales ? lastRetailSalesDecrease + 1 : 0
      }

      let durableGoodsIncrease = indicator.durableGoodsMonthlyIncrease
      let durableGoodsDecrease = indicator.durableGoodsMonthlyDecrease
      if (indicator.durableGoods && lastIndicator.durableGoods) {
        const lastDurableGoodsIncrease = lastIndicator.durableGoodsMonthlyIncrease || 0
        durableGoodsIncrease = indicator.durableGoods > lastIndicator.durableGoods ? lastDurableGoodsIncrease + 1 : 0
        const lastDurableGoodsDecrease = lastIndicator.durableGoodsMonthlyDecrease || 0
        durableGoodsDecrease = indicator.durableGoods < lastIndicator.durableGoods ? lastDurableGoodsDecrease + 1 : 0
      }

      let unemploymentRateIncrease = indicator.unemploymentRateMonthlyIncrease
      let unemploymentRateDecrease = indicator.unemploymentRateMonthlyDecrease
      if (indicator.unemploymentRate && lastIndicator.unemploymentRate) {
        const lastUnemploymentRateIncrease = lastIndicator.unemploymentRateMonthlyIncrease || 0
        unemploymentRateIncrease = indicator.unemploymentRate > lastIndicator.unemploymentRate ? lastUnemploymentRateIncrease + 1 : 0
        const lastUnemploymentRateDecrease = lastIndicator.unemploymentRateMonthlyDecrease || 0
        unemploymentRateDecrease = indicator.unemploymentRate < lastIndicator.unemploymentRate ? lastUnemploymentRateDecrease + 1 : 0
      }

      let nofarmPayrollIncrease = indicator.nonfarmPayrollMonthlyIncrease
      let nofarmPayrollDecrease = indicator.nonfarmPayrollMonthlyDecrease
      if (indicator.nonfarmPayroll && lastIndicator.nonfarmPayroll) {
        const lastNofarmPayrollIncrease = lastIndicator.nonfarmPayrollMonthlyIncrease || 0
        nofarmPayrollIncrease = indicator.nonfarmPayroll > lastIndicator.nonfarmPayroll ? lastNofarmPayrollIncrease + 1 : 0
        const lastNofarmPayrollDecrease = lastIndicator.nonfarmPayrollMonthlyDecrease || 0
        nofarmPayrollDecrease = indicator.nonfarmPayroll < lastIndicator.nonfarmPayroll ? lastNofarmPayrollDecrease + 1 : 0
      }

      const hasUpdate = fundsRateIncrease !== indicator.fundsRateMonthlyIncrease ||
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
        retailSalesIncrease !== indicator.retailSalesMonthlyIncrease ||
        retailSalesDecrease !== indicator.retailSalesMonthlyDecrease ||
        durableGoodsIncrease !== indicator.durableGoodsMonthlyIncrease ||
        durableGoodsDecrease !== indicator.durableGoodsMonthlyDecrease ||
        unemploymentRateIncrease !== indicator.unemploymentRateMonthlyIncrease ||
        unemploymentRateDecrease !== indicator.unemploymentRateMonthlyDecrease ||
        nofarmPayrollIncrease !== indicator.nonfarmPayrollMonthlyIncrease ||
        nofarmPayrollDecrease !== indicator.nonfarmPayrollMonthlyDecrease

      let updatedIndicator = indicator
      if (hasUpdate) {
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
          retailSalesMonthlyIncrease: retailSalesIncrease,
          retailSalesMonthlyDecrease: retailSalesDecrease,
          durableGoodsMonthlyIncrease: durableGoodsIncrease,
          durableGoodsMonthlyDecrease: durableGoodsDecrease,
          unemploymentRateMonthlyIncrease: unemploymentRateIncrease,
          unemploymentRateMonthlyDecrease: unemploymentRateDecrease,
          nonfarmPayrollMonthlyIncrease: nofarmPayrollIncrease,
          nonfarmPayrollMonthlyDecrease: nofarmPayrollDecrease,
        }, transaction)
      }
      checkedMonthly.push(updatedIndicator)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
