import * as errorEnum from '../enums/error'
import * as marketAdapter from '../adapters/market'
import * as dateTool from '../tools/date'
import * as marketTool from '../tools/market'
import * as runTool from '../tools/run'
import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'

export const syncPrices = async (
  region: string,
  symbol: string
): Promise<{
  ticker: tickerModel.Ticker,
  newDaily: tickerDailyModel.TickerDaily[]
}> => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const tickerData = await marketAdapter.getTickerPrices(symbol)

  const metaData = tickerData['Meta Data']
  const lastRefreshed = metaData['3. Last Refreshed']

  if (lastRefreshed === ticker.lastPriceDate) {
    return { ticker, newDaily: [] }
  }

  const allDaysData = tickerData['Time Series (Daily)']

  const startDate = ticker.lastPriceDate
    ? dateTool.getNextDate(ticker.lastPriceDate)
    : dateTool.getInitialDate()
  const endDate = dateTool.getCurrentDate()

  const allDates = dateTool.getDaysInRange(startDate, endDate)

  const newRecords = []
  for (const date of allDates) {
    const dailyData = allDaysData[date]
    if (!dailyData) continue

    const record = await tickerDailyModel.getByUK(ticker.id, date)
    if (record) continue

    const closePrice = dailyData['4. close']
    const volume = dailyData['6. volume']
    const dividendAmount = dailyData['7. dividend amount']
    const splitCoefficient = dailyData['8. split coefficient']

    const previousRecord = await tickerDailyModel.getPrevious(ticker.id, date)

    const adjustedClose = previousRecord
      ? marketTool.getAdjustedClosePrice(
        closePrice,
        splitCoefficient,
        previousRecord.closePrice,
        previousRecord.adjustedClosePrice
      )
      : closePrice

    const dividendPercent = previousRecord
      ? marketTool.getDividendPercent(
        dividendAmount,
        previousRecord.closePrice
      )
      : '0.00'

    const newRecord = await tickerDailyModel.create({
      tickerId: ticker.id,
      date,
      volume: parseInt(volume),
      closePrice: closePrice,
      splitCoefficient: splitCoefficient.substring(0, 10),
      dividendPercent: dividendPercent,
      adjustedClosePrice: adjustedClose
    })
    newRecords.push(newRecord)
  }

  const newTickerInfo: tickerModel.TickerEdit = {}
  newTickerInfo.lastPriceDate = lastRefreshed
  if (!ticker.firstPriceDate) {
    newTickerInfo.firstPriceDate = newRecords[0].date
  }

  const updatedTicker = await tickerModel.update(ticker.id, newTickerInfo)

  return {
    ticker: updatedTicker,
    newDaily: newRecords
  }
}

export const syncAllPrices = async (
  date: string
): Promise<{
  tickers: tickerModel.Ticker[]
}> => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickers = []
  for (const ticker of allTickers) {
    const isDateSynced = ticker.lastPriceDate >= date
    if (isDateSynced) continue
    const result = await syncPrices(ticker.region, ticker.symbol)
    updatedTickers.push(result.ticker)
    await runTool.sleep(cooldown)
  }

  return { tickers: updatedTickers }
}

export const syncEarnings = async (
  region: string,
  symbol: string,
  forceRecheck: boolean = false
): Promise<{
  ticker: tickerModel.Ticker,
  relatedYearly: tickerYearlyModel.TickerYearly[],
  relatedQuarterly: tickerQuarterlyModel.TickerQuarterly[]
}> => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const tickerData = await marketAdapter.getTickerEarnings(symbol)

  const annualEarnings = tickerData.annualEarnings
  if (!annualEarnings) console.info(`Annual Earning not exist for ${ticker.symbol}`)

  const lastYearlyRecord = !forceRecheck && await tickerYearlyModel.getLatest(
    ticker.id,
    [{ key: 'eps', type: 'IS NOT', value: null }]
  )

  const startYear = lastYearlyRecord
    ? dateTool.getNextYear(lastYearlyRecord.year)
    : dateTool.getInitialYear()
  const endYear = dateTool.getCurrentYear()
  const allYears = dateTool.getYearsInRange(startYear, endYear)

  const relatedYearly = []
  for (const year of allYears) {
    const matchedEarning = annualEarnings.find(earning => {
      return year === earning.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedEarning) continue

    const yearlyEPS = {
      year,
      earningDate: matchedEarning.fiscalDateEnding,
      eps: matchedEarning.reportedEPS.substring(0, 10)
    }

    const currentRecord = await tickerYearlyModel.getByUK(ticker.id, year)

    if (!currentRecord) {
      const createdRecord = await tickerYearlyModel.create({
        tickerId: ticker.id,
        ...yearlyEPS
      })
      relatedYearly.push(createdRecord)
    } else if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await tickerYearlyModel.update(currentRecord.id, yearlyEPS)
      relatedYearly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedYearly.push(currentRecord)
    }
  }

  const quarterlyEarnings = tickerData.quarterlyEarnings
  if (!quarterlyEarnings) console.info(`Quarterly Earning not exist for ${ticker.symbol}`)

  const lastQuarterlyRecord = !forceRecheck && await tickerQuarterlyModel.getLatest(
    ticker.id,
    [{ key: 'eps', type: 'IS NOT', value: null }]
  )

  const startQuarter = lastQuarterlyRecord
    ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
    : dateTool.getInitialQuarter(ticker.quarterlyEPSMonthDiffer)
  const endQuarter = dateTool.getCurrentQuater()
  const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

  const relatedQuarterly = []
  for (const quarter of allQuarters) {
    const matchedEarning = quarterlyEarnings.find(earning => {
      return quarter === earning.fiscalDateEnding.substring(0, 7)
    })
    if (!matchedEarning) continue

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
      epsSurprisePercent
    }

    const currentRecord = await tickerQuarterlyModel.getByUK(ticker.id, quarter)

    if (!currentRecord) {
      const createdRecord = await tickerQuarterlyModel.create({
        tickerId: ticker.id,
        ...quarterlyEPS
      })
      relatedQuarterly.push(createdRecord)
    } else if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await tickerQuarterlyModel.update(currentRecord.id, quarterlyEPS)
      relatedQuarterly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedQuarterly.push(currentRecord)
    }
  }

  const newTickerInfo: tickerModel.TickerEdit = {}
  if (relatedYearly.length) {
    newTickerInfo.lastEPSYear = relatedYearly[relatedYearly.length - 1].year
    if (!ticker.firstEPSYear || forceRecheck) newTickerInfo.firstEPSYear = relatedYearly[0].year
  }
  if (relatedQuarterly.length) {
    newTickerInfo.lastEPSQuarter = relatedQuarterly[relatedQuarterly.length - 1].quarter
    if (!ticker.firstEPSQuarter || forceRecheck) newTickerInfo.firstEPSQuarter = relatedQuarterly[0].quarter
  }

  const updateTicker = Object.keys(newTickerInfo).length
    ? await tickerModel.update(ticker.id, newTickerInfo)
    : ticker

  return { ticker: updateTicker, relatedYearly, relatedQuarterly }
}

export const syncAllEarnings = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false
): Promise<{
  tickers: tickerModel.Ticker[]
}> => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickers = []
  for (const ticker of allTickers) {
    const isYearSynced = ticker.lastEPSYear >= year
    const isQuarterSynced = ticker.lastEPSQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) continue
    const result = await syncEarnings(ticker.region, ticker.symbol, forceRecheck)
    updatedTickers.push(result.ticker)
    await runTool.sleep(cooldown)
  }

  return { tickers: updatedTickers }
}

export const syncIncomes = async (
  region: string,
  symbol: string,
  forceRecheck: boolean = false
): Promise<{
  ticker: tickerModel.Ticker,
  relatedYearly: tickerYearlyModel.TickerYearly[],
  relatedQuarterly: tickerQuarterlyModel.TickerQuarterly[]
}> => {
  const ticker = await tickerModel.getByUK(region, symbol)
  if (!ticker) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const tickerData = await marketAdapter.getTickerIncomes(symbol)

  const annualIncomes = tickerData.annualReports
  if (!annualIncomes) console.info(`Annual Incomes not exist for ${ticker.symbol}`)

  const lastYearlyRecord = !forceRecheck && await tickerYearlyModel.getLatest(
    ticker.id,
    [{ key: 'netIncome', type: 'IS NOT', value: null }]
  )

  const startYear = lastYearlyRecord
    ? dateTool.getNextYear(lastYearlyRecord.year)
    : dateTool.getInitialYear()
  const endYear = dateTool.getCurrentYear()
  const allYears = dateTool.getYearsInRange(startYear, endYear)

  const relatedYearly = []
  for (const year of allYears) {
    const matchedIncome = annualIncomes.find(income => {
      return year === income.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedIncome) continue

    const yearlyIncome = {
      year,
      ebitda: matchedIncome.ebitda,
      netIncome: matchedIncome.netIncome,
      grossProfit: matchedIncome.grossProfit,
      totalRevenue: matchedIncome.totalRevenue,
      costOfRevenue: matchedIncome.costOfRevenue
    }

    const currentRecord = await tickerYearlyModel.getByUK(ticker.id, year)

    if (!currentRecord) {
      const createdRecord = await tickerYearlyModel.create({
        tickerId: ticker.id,
        ...yearlyIncome
      })
      relatedYearly.push(createdRecord)
    } else if (currentRecord && !currentRecord.netIncome) {
      const updatedRecord = await tickerYearlyModel.update(currentRecord.id, yearlyIncome)
      relatedYearly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedYearly.push(currentRecord)
    }
  }

  const quarterlyIncomes = tickerData.quarterlyReports
  if (!quarterlyIncomes) console.info(`Quarterly Incomes not exist for ${ticker.symbol}`)

  const lastQuarterlyRecord = !forceRecheck && await tickerQuarterlyModel.getLatest(
    ticker.id,
    [{ key: 'netIncome', type: 'IS NOT', value: null }]
  )

  const startQuarter = lastQuarterlyRecord
    ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
    : dateTool.getInitialQuarter(ticker.quarterlyEPSMonthDiffer)
  const endQuarter = dateTool.getCurrentQuater()
  const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

  const relatedQuarterly = []
  for (const quarter of allQuarters) {
    const matchedIncome = quarterlyIncomes.find(income => {
      return quarter === income.fiscalDateEnding.substring(0, 7)
    })
    if (!matchedIncome) continue

    const quarterlyEPS = {
      quarter,
      ebitda: matchedIncome.ebitda,
      netIncome: matchedIncome.netIncome,
      grossProfit: matchedIncome.grossProfit,
      totalRevenue: matchedIncome.totalRevenue,
      costOfRevenue: matchedIncome.costOfRevenue
    }

    const currentRecord = await tickerQuarterlyModel.getByUK(ticker.id, quarter)

    if (!currentRecord) {
      const createdRecord = await tickerQuarterlyModel.create({
        tickerId: ticker.id,
        ...quarterlyEPS
      })
      relatedQuarterly.push(createdRecord)
    } else if (currentRecord && !currentRecord.netIncome) {
      const updatedRecord = await tickerQuarterlyModel.update(currentRecord.id, quarterlyEPS)
      relatedQuarterly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedQuarterly.push(currentRecord)
    }
  }

  const newTickerInfo: tickerModel.TickerEdit = {}
  if (relatedYearly.length) {
    newTickerInfo.lastIncomeYear = relatedYearly[relatedYearly.length - 1].year
    if (!ticker.firstIncomeYear || forceRecheck) newTickerInfo.firstIncomeYear = relatedYearly[0].year
  }
  if (relatedQuarterly.length) {
    newTickerInfo.lastIncomeQuarter = relatedQuarterly[relatedQuarterly.length - 1].quarter
    if (!ticker.firstIncomeQuarter || forceRecheck) newTickerInfo.firstIncomeQuarter = relatedQuarterly[0].quarter
  }

  const updateTicker = Object.keys(newTickerInfo).length
    ? await tickerModel.update(ticker.id, newTickerInfo)
    : ticker

  return { ticker: updateTicker, relatedYearly, relatedQuarterly }
}

export const syncAllIncomes = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false
): Promise<{
  tickers: tickerModel.Ticker[]
}> => {
  const allTickers = await tickerModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickers = []
  for (const ticker of allTickers) {
    const isYearSynced = ticker.lastIncomeYear >= year
    const isQuarterSynced = ticker.lastIncomeQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) continue
    const result = await syncIncomes(ticker.region, ticker.symbol, forceRecheck)
    updatedTickers.push(result.ticker)
    await runTool.sleep(cooldown)
  }

  return { tickers: updatedTickers }
}
