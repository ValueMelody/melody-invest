import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as entityModel from 'models/entity'
import * as interfaces from '@shared/interfaces'
import * as priceLogic from 'logics/price'
import * as runTool from 'tools/run'
import * as tickerDailyModel from 'models/tickerDaily'
import * as tickerModel from 'models/ticker'
import * as tickerQuarterlyModel from 'models/tickerQuarterly'
import * as tickerYearlyModel from 'models/tickerYearly'
import * as tiingoAdapter from 'adapters/tiingo'

export const syncPrices = async (
  ticker: interfaces.tickerModel.Record,
  entity: interfaces.entityModel.Record,
  date: string,
): Promise<string | undefined> => {
  let prices

  const startDate = ticker.lastPriceDate ? dateTool.getNextDate(ticker.lastPriceDate) : dateTool.getInitialDate()

  try {
    prices = await tiingoAdapter.getTickerPrices(
      ticker.symbol,
      startDate,
      date,
      entity.dataKey!,
    )
  } catch (e: any) {
    if (e?.response?.data?.detail === 'Invalid token.') {
      await databaseAdapter.runWithTransaction(async (transaction) => {
        await entityModel.update(entity.id, { isValidKey: false }, transaction)
      })
    }
    return `${ticker.id} fetch error: ${e} `
  }

  if (!prices?.length) return

  let firstPriceDate = ''
  let latestRecord = await tickerDailyModel.getPreviousOne(ticker.id, startDate)
  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(prices, async (price: tiingoAdapter.TiingoPrice) => {
      const date = price.date.substring(0, 10)

      const splitMultiplier = priceLogic.getSplitMultiplier(
        price.splitFactor,
        latestRecord,
      )

      const createdDaily = await tickerDailyModel.create({
        tickerId: ticker.id,
        date,
        volume: price.volume,
        closePrice: priceLogic.convertToPaddingPrice(price.close),
        splitMultiplier,
      }, transaction)

      latestRecord = createdDaily
      if (!firstPriceDate) firstPriceDate = date
    })

    if (firstPriceDate && latestRecord) {
      const newTickerInfo: interfaces.tickerModel.Update = {
        lastPriceDate: latestRecord.date,
      }
      if (!ticker.firstPriceDate) newTickerInfo.firstPriceDate = firstPriceDate
      await tickerModel.update(ticker.id, newTickerInfo, transaction)

      if (!entity.isValidKey) await entityModel.update(entity.id, { isValidKey: true }, transaction)

      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllPrices = async (date: string): Promise<string[]> => {
  const entities = await entityModel.getAll()
  const cooldown = adapterEnum.MarketConfig.CooldownSeconds
  const notes: string[] = []

  await runTool.asyncForEach(entities, async (entity: interfaces.entityModel.Record) => {
    if (!entity.dataKey || entity.isValidKey === false) return
    console.info(`checking entity: ${entity.id}`)

    const tickers = await tickerModel.getAllByEntity(entity.id)
    await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerModel.Record) => {
      if (ticker.isDelisted) return
      const isDateSynced = ticker.lastPriceDate && ticker.lastPriceDate >= date
      if (isDateSynced) return
      console.info(`checking ticker: ${ticker.id}`)
      const note = await syncPrices(ticker, entity, date)
      if (note) notes.push(note)
      await runTool.sleep(cooldown)
    })
  })

  return notes
}

export const syncFinancials = async (
  ticker: interfaces.tickerModel.Record,
  entity: interfaces.entityModel.Record,
) => {
  let financials
  try {
    financials = await tiingoAdapter.getTickerFinancials(
      ticker.symbol,
      entity.dataKey!,
    )
  } catch (e: any) {
    return `${ticker.id} fetch error: ${e} `
  }

  if (!financials?.length) return

  const quarterlyRecords: interfaces.tickerQuarterlyModel.Record[] = []
  const yearlyRecords: interfaces.tickerYearlyModel.Record[] = []
  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(financials, async (financial: tiingoAdapter.TiingoFinancial) => {
      const values = {
        eps: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'eps')?.value?.toString() || null,
        ebitda: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'ebitda')?.value?.toString() || null,
        netIncome: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'netinc')?.value?.toString() || null,
        grossProfit: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'grossProfit')?.value?.toString() || null,
        totalRevenue: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'revenue')?.value?.toString() || null,
        costOfRevenue: financial?.statementData?.incomeStatement
          ?.find((info) => info.dataCode === 'costRev')?.value?.toString() || null,
        totalLiabilities: financial?.statementData?.balanceSheet
          ?.find((info) => info.dataCode === 'totalLiabilities')?.value?.toString() || null,
        totalAssets: financial?.statementData?.balanceSheet
          ?.find((info) => info.dataCode === 'totalAssets')?.value?.toString() || null,
        equity: financial?.statementData?.balanceSheet
          ?.find((info) => info.dataCode === 'equity')?.value?.toString() || null,
        outstandingShares: financial?.statementData?.balanceSheet
          ?.find((info) => info.dataCode === 'sharesBasic')?.value?.toString() || null,
        freeCashFlow: financial?.statementData?.cashFlow
          ?.find((info) => info.dataCode === 'freeCashFlow')?.value?.toString() || null,
      }

      const quarter = dateTool.getQuarterByDate(financial.date)
      const isYearlyReport = financial.quarter === 0
      if (isYearlyReport) {
        if (
          !!ticker.lastFinancialYear && !!ticker.firstFinancialYear &&
          ticker.lastFinancialYear >= quarter && ticker.firstFinancialYear <= quarter
        ) return
        const yearlyRecord = await tickerYearlyModel.create({
          ...values,
          tickerId: ticker.id,
          year: quarter,
          earningDate: financial.date,
        }, transaction)
        yearlyRecords.push(yearlyRecord)
      } else {
        if (
          !!ticker.lastFinancialQuarter && !!ticker.firstFinancialQuarter &&
          ticker.lastFinancialQuarter >= quarter && ticker.firstFinancialQuarter <= quarter
        ) return
        const quarterlyRecord = await tickerQuarterlyModel.create({
          ...values,
          grossMargin: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'grossMargin')?.value?.toString() || null,
          roa: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'roa')?.value?.toString() || null,
          roe: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'roe')?.value?.toString() || null,
          epsQoQ: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'epsQoQ')?.value?.toFixed(2) || null,
          revenueQoQ: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'revenueQoQ')?.value?.toFixed(2) || null,
          debtEquity: financial?.statementData?.overview
            ?.find((info) => info.dataCode === 'debtEquity')?.value?.toString() || null,
          tickerId: ticker.id,
          quarter,
          earningDate: financial.date,
        }, transaction)
        quarterlyRecords.push(quarterlyRecord)
      }
    })

    if (!!quarterlyRecords.length || !!yearlyRecords.length) {
      const tickerValues: interfaces.tickerModel.Update = {}
      const sortedQuarterly = quarterlyRecords.sort((prev, curr) => prev.quarter < curr.quarter ? -1 : 1)
      if (sortedQuarterly.length) {
        const lastQuarter = sortedQuarterly[sortedQuarterly.length - 1].quarter
        const firstQuarter = sortedQuarterly[0].quarter
        if (!ticker.lastFinancialQuarter || ticker.lastFinancialQuarter < lastQuarter) {
          tickerValues.lastFinancialQuarter = lastQuarter
        }
        if (!ticker.firstFinancialQuarter || ticker.firstFinancialQuarter > firstQuarter) {
          tickerValues.firstFinancialQuarter = firstQuarter
        }
      }

      const sortedYearly = yearlyRecords.sort((prev, curr) => prev.year < curr.year ? -1 : 1)
      if (sortedYearly.length) {
        const lastYear = sortedYearly[sortedYearly.length - 1].year
        const firstYear = sortedYearly[0].year
        if (!ticker.lastFinancialYear || ticker.lastFinancialYear < lastYear) {
          tickerValues.lastFinancialYear = lastYear
        }
        if (!ticker.firstFinancialYear || ticker.firstFinancialYear > firstYear) {
          tickerValues.firstFinancialYear = firstYear
        }
      }

      await tickerModel.update(ticker.id, tickerValues, transaction)

      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const syncAllFinancials = async (
  quarter: string,
) => {
  const entities = await entityModel.getAll()

  await runTool.asyncForEach(entities, async (entity: interfaces.entityModel.Record) => {
    if (!entity.dataKey || entity.isValidKey === false) return
    console.info(`checking entity: ${entity.id}`)

    const tickers = await tickerModel.getAllByEntity(entity.id)
    await runTool.asyncForEach(tickers, async (ticker: interfaces.tickerModel.Record) => {
      if (ticker.isDelisted) return
      const isDateSynced = ticker.lastFinancialQuarter && ticker.lastFinancialQuarter >= quarter
      if (isDateSynced) return
      console.info(`checking ticker: ${ticker.id}`)
      await syncFinancials(ticker, entity)
    })
  })
}
