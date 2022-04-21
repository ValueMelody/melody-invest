import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as marketAdapter from '../adapters/market'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as priceLogic from '../logics/price'
import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as databaseAdapter from '../adapters/database'

export const syncPrices = async (
  region: string,
  symbol: string,
) => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.Default.NotFound

  const tickerData = await marketAdapter.getTickerPrices(symbol)
  const metaData = tickerData['Meta Data']
  const lastRefreshed = metaData['3. Last Refreshed'].substring(0, 10)

  if (lastRefreshed === ticker.lastPriceDate) return

  const allDaysData = tickerData['Time Series (Daily)']

  const startDate = ticker.lastPriceDate
    ? dateTool.getNextDate(ticker.lastPriceDate)
    : dateTool.getInitialDate()
  const endDate = dateTool.getCurrentDate()

  const allDates = dateTool.getDaysInRange(startDate, endDate)
  if (!allDates.length) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    let firstPriceDate: string | null = null
    let previousRecord = await tickerDailyModel.getPreviousOne(ticker.id, allDates[0])
    await runTool.asyncForEach(allDates, async (date: string) => {
      const dailyData = allDaysData[date]
      if (!dailyData) return

      const closePrice: string = dailyData['4. close']
      const volume: string = dailyData['6. volume']
      const dividendAmount: string = dailyData['7. dividend amount']
      const splitCoefficient: string = dailyData['8. split coefficient']

      const splitMultiplier = priceLogic.getSplitMultiplier(
        splitCoefficient,
        previousRecord,
      )

      previousRecord = await tickerDailyModel.create({
        tickerId: ticker.id,
        date,
        volume,
        closePrice: priceLogic.convertToPaddingPrice(closePrice),
        splitMultiplier: splitMultiplier.toFixed(5),
        dividendAmount,
      }, transaction)

      if (!firstPriceDate) firstPriceDate = date
    })

    const newTickerInfo: interfaces.tickerModel.Update = {
      lastPriceDate: lastRefreshed,
    }
    if (!ticker.firstPriceDate && firstPriceDate) newTickerInfo.firstPriceDate = firstPriceDate

    await tickerModel.update(ticker.id, newTickerInfo, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllPrices = async (date: string) => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  await runTool.asyncForEach(allTickers, async (ticker: interfaces.tickerModel.Record) => {
    const isDateSynced = ticker.lastPriceDate && ticker.lastPriceDate >= date
    if (isDateSynced) return
    await syncPrices(ticker.region, ticker.symbol)
    await runTool.sleep(cooldown)
  })
}

export const syncEarnings = async (
  region: string,
  symbol: string,
  forceRecheck: boolean = false,
) => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.Default.NotFound

  const tickerData = await marketAdapter.getTickerEarnings(symbol)

  const transaction = await databaseAdapter.createTransaction()
  try {
    const annualEarnings = tickerData.annualEarnings
    if (!annualEarnings) console.info(`Annual Earning not exist for ${ticker.symbol}`)

    const lastYearlyRecord = !forceRecheck && await tickerYearlyModel.getLatest(
      ticker.id,
      [{ key: 'eps', type: 'IS NOT', value: null }],
    )

    const startYear = lastYearlyRecord
      ? dateTool.getNextYear(lastYearlyRecord.year)
      : dateTool.getInitialYear()
    const endYear = dateTool.getCurrentYear()
    const allYears = dateTool.getYearsInRange(startYear, endYear)

    const relatedYears: string[] = []
    await runTool.asyncForEach(allYears, async (year: string) => {
      const matchedEarning = annualEarnings.find((earning) => {
        return year === earning.fiscalDateEnding.substring(0, 4)
      })
      if (!matchedEarning) return

      const eps = matchedEarning.reportedEPS === 'None'
        ? null
        : matchedEarning.reportedEPS.substring(0, 10)

      const yearlyEPS = {
        year,
        earningDate: matchedEarning.fiscalDateEnding,
        eps,
      }

      const currentRecord = await tickerYearlyModel.getRawByUK(ticker.id, year)

      if (!currentRecord) {
        const createdRecord = await tickerYearlyModel.create({
          tickerId: ticker.id,
          ...yearlyEPS,
        }, transaction)
        relatedYears.push(createdRecord.year)
      } else if (currentRecord && currentRecord.eps !== yearlyEPS.eps) {
        const updatedRecord = await tickerYearlyModel.update(currentRecord.id, yearlyEPS, transaction)
        relatedYears.push(updatedRecord.year)
      } else if (forceRecheck) {
        relatedYears.push(currentRecord.year)
      }
    })

    const quarterlyEarnings = tickerData.quarterlyEarnings
    if (!quarterlyEarnings) console.info(`Quarterly Earning not exist for ${ticker.symbol}`)

    const lastQuarterlyRecord = !forceRecheck && await tickerQuarterlyModel.getLatest(
      ticker.id,
      [{ key: 'eps', type: 'IS NOT', value: null }],
    )

    const startQuarter = lastQuarterlyRecord
      ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
      : dateTool.getInitialQuarter()
    const endQuarter = dateTool.getCurrentQuater()
    const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

    const relatedQuarters: string[] = []
    await runTool.asyncForEach(allQuarters, async (quarter: string) => {
      const matchedEarning = quarterlyEarnings.find((earning) => {
        return dateTool.isNearbyQuarter(earning.fiscalDateEnding, quarter)
      })
      if (!matchedEarning) return

      const eps = matchedEarning.reportedEPS === 'None'
        ? null
        : matchedEarning.reportedEPS.substring(0, 10)
      const estimatedEPS = matchedEarning.estimatedEPS === 'None'
        ? null
        : matchedEarning.estimatedEPS.substring(0, 10)
      const epsSurprisePercent = matchedEarning.surprisePercentage === 'None'
        ? null
        : matchedEarning.surprisePercentage.substring(0, 5)
      const quarterlyEPS = {
        quarter,
        earningDate: matchedEarning.fiscalDateEnding,
        earningReportDate: matchedEarning.reportedDate,
        eps,
        estimatedEPS,
        epsSurprisePercent,
      }

      const currentRecord = await tickerQuarterlyModel.getRawByUK(ticker.id, quarter)
      if (!currentRecord) {
        const createdRecord = await tickerQuarterlyModel.create({
          tickerId: ticker.id,
          ...quarterlyEPS,
        }, transaction)
        relatedQuarters.push(createdRecord.quarter)
      } else if (currentRecord && (
        currentRecord.eps !== quarterlyEPS.eps ||
        currentRecord.estimatedEPS !== quarterlyEPS.estimatedEPS ||
        currentRecord.epsSurprisePercent !== quarterlyEPS.epsSurprisePercent
      )) {
        const updatedRecord = await tickerQuarterlyModel.update(currentRecord.id, quarterlyEPS, transaction)
        relatedQuarters.push(updatedRecord.quarter)
      } else if (forceRecheck) {
        relatedQuarters.push(currentRecord.quarter)
      }
    })

    const newTickerInfo: interfaces.tickerModel.Update = {}
    if (relatedYears.length) {
      newTickerInfo.lastEPSYear = relatedYears[relatedYears.length - 1]
      if (!ticker.firstEPSYear || forceRecheck) newTickerInfo.firstEPSYear = relatedYears[0]
    }
    if (relatedQuarters.length) {
      newTickerInfo.lastEPSQuarter = relatedQuarters[relatedQuarters.length - 1]
      if (!ticker.firstEPSQuarter || forceRecheck) newTickerInfo.firstEPSQuarter = relatedQuarters[0]
    }

    if (Object.keys(newTickerInfo).length) await tickerModel.update(ticker.id, newTickerInfo, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllEarnings = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false,
) => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  await runTool.asyncForEach(allTickers, async (ticker: interfaces.tickerModel.Record) => {
    const isYearSynced = ticker.lastEPSYear && ticker.lastEPSYear >= year
    const isQuarterSynced = ticker.lastEPSQuarter && ticker.lastEPSQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) return
    await syncEarnings(ticker.region, ticker.symbol, forceRecheck)
    await runTool.sleep(cooldown)
  })
}

export const syncIncomes = async (
  region: string,
  symbol: string,
  forceRecheck: boolean = false,
) => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.Default.NotFound

  const tickerData = await marketAdapter.getTickerIncomes(symbol)

  const transaction = await databaseAdapter.createTransaction()
  try {
    const annualIncomes = tickerData.annualReports
    if (!annualIncomes) console.info(`Annual Incomes not exist for ${ticker.symbol}`)

    const lastYearlyRecord = !forceRecheck && await tickerYearlyModel.getLatest(
      ticker.id,
      [{ key: 'netIncome', type: 'IS NOT', value: null }],
    )

    const startYear = lastYearlyRecord
      ? dateTool.getNextYear(lastYearlyRecord.year)
      : dateTool.getInitialYear()
    const endYear = dateTool.getCurrentYear()
    const allYears = dateTool.getYearsInRange(startYear, endYear)

    const relatedYears: string[] = []
    await runTool.asyncForEach(allYears, async (year: string) => {
      const matchedIncome = annualIncomes.find((income) => {
        return year === income.fiscalDateEnding.substring(0, 4)
      })
      if (!matchedIncome) return

      const ebitda = matchedIncome.ebitda === 'None' ? null : matchedIncome.ebitda
      const netIncome = matchedIncome.netIncome === 'None' ? null : matchedIncome.netIncome
      const grossProfit = matchedIncome.grossProfit === 'None' ? null : matchedIncome.grossProfit
      const totalRevenue = matchedIncome.totalRevenue === 'None' ? null : matchedIncome.totalRevenue
      const costOfRevenue = matchedIncome.costOfRevenue === 'None' ? null : matchedIncome.costOfRevenue

      const yearlyIncome = {
        year, ebitda, netIncome, grossProfit, totalRevenue, costOfRevenue,
      }

      const currentRecord = await tickerYearlyModel.getRawByUK(ticker.id, year)
      if (!currentRecord) {
        const createdRecord = await tickerYearlyModel.create({
          tickerId: ticker.id,
          ...yearlyIncome,
        }, transaction)
        relatedYears.push(createdRecord.year)
      } else if (currentRecord && (
        currentRecord.ebitda !== yearlyIncome.ebitda ||
        currentRecord.netIncome !== yearlyIncome.netIncome ||
        currentRecord.grossProfit !== yearlyIncome.grossProfit ||
        currentRecord.totalRevenue !== yearlyIncome.totalRevenue ||
        currentRecord.costOfRevenue !== yearlyIncome.costOfRevenue
      )) {
        const updatedRecord = await tickerYearlyModel.update(currentRecord.id, yearlyIncome, transaction)
        relatedYears.push(updatedRecord.year)
      } else if (forceRecheck) {
        relatedYears.push(currentRecord.year)
      }
    })

    const quarterlyIncomes = tickerData.quarterlyReports
    if (!quarterlyIncomes) console.info(`Quarterly Incomes not exist for ${ticker.symbol}`)

    const lastQuarterlyRecord = !forceRecheck && await tickerQuarterlyModel.getLatest(
      ticker.id,
      [{ key: 'netIncome', type: 'IS NOT', value: null }],
    )

    const startQuarter = lastQuarterlyRecord
      ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
      : dateTool.getInitialQuarter()
    const endQuarter = dateTool.getCurrentQuater()
    const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

    const relatedQuarters: string[] = []
    await runTool.asyncForEach(allQuarters, async (quarter: string) => {
      const matchedIncome = quarterlyIncomes.find((income) => {
        return dateTool.isNearbyQuarter(income.fiscalDateEnding, quarter)
      })
      if (!matchedIncome) return

      const ebitda = matchedIncome.ebitda === 'None' ? null : matchedIncome.ebitda
      const netIncome = matchedIncome.netIncome === 'None' ? null : matchedIncome.netIncome
      const grossProfit = matchedIncome.grossProfit === 'None' ? null : matchedIncome.grossProfit
      const totalRevenue = matchedIncome.totalRevenue === 'None' ? null : matchedIncome.totalRevenue
      const costOfRevenue = matchedIncome.costOfRevenue === 'None' ? null : matchedIncome.costOfRevenue

      const quarterlyEPS = {
        quarter, ebitda, netIncome, grossProfit, totalRevenue, costOfRevenue,
      }

      const currentRecord = await tickerQuarterlyModel.getRawByUK(ticker.id, quarter)
      if (!currentRecord) {
        const createdRecord = await tickerQuarterlyModel.create({
          tickerId: ticker.id,
          ...quarterlyEPS,
        }, transaction)
        relatedQuarters.push(createdRecord.quarter)
      } else if (currentRecord && (
        currentRecord.ebitda !== quarterlyEPS.ebitda ||
        currentRecord.netIncome !== quarterlyEPS.netIncome ||
        currentRecord.grossProfit !== quarterlyEPS.grossProfit ||
        currentRecord.totalRevenue !== quarterlyEPS.totalRevenue ||
        currentRecord.costOfRevenue !== quarterlyEPS.costOfRevenue
      )) {
        const updatedRecord = await tickerQuarterlyModel.update(currentRecord.id, quarterlyEPS, transaction)
        relatedQuarters.push(updatedRecord.quarter)
      } else if (forceRecheck) {
        relatedQuarters.push(currentRecord.quarter)
      }
    })

    const newTickerInfo: interfaces.tickerModel.Update = {}
    if (relatedYears.length) {
      newTickerInfo.lastIncomeYear = relatedYears[relatedYears.length - 1]
      if (!ticker.firstIncomeYear || forceRecheck) newTickerInfo.firstIncomeYear = relatedYears[0]
    }
    if (relatedQuarters.length) {
      newTickerInfo.lastIncomeQuarter = relatedQuarters[relatedQuarters.length - 1]
      if (!ticker.firstIncomeQuarter || forceRecheck) newTickerInfo.firstIncomeQuarter = relatedQuarters[0]
    }

    if (Object.keys(newTickerInfo).length) await tickerModel.update(ticker.id, newTickerInfo, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllIncomes = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false,
) => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  await runTool.asyncForEach(allTickers, async (ticker: interfaces.tickerModel.Record) => {
    const isYearSynced = ticker.lastIncomeYear && ticker.lastIncomeYear >= year
    const isQuarterSynced = ticker.lastIncomeQuarter && ticker.lastIncomeQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) return
    await syncIncomes(ticker.region, ticker.symbol, forceRecheck)
    await runTool.sleep(cooldown)
  })
}
