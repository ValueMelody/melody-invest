import axios from 'axios'
import qs from 'qs'
import * as marketEnum from '../enums/market'

const BaseURL = 'https://www.alphavantage.co/query'

export const getCooldownPerMin = (): number => {
  return parseInt(process.env.MARKET_KEY_COOLDOWN!) || 15
}

export const getTickerPrices = async (
  symbol: string,
) => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Prices,
    symbol: symbol.toUpperCase(),
    outputsize: 'full',
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  return result.data
}

export interface AnnualEarning {
  fiscalDateEnding: string;
  reportedEPS: string;
}

export interface QuarterlyEarning {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: string;
  estimatedEPS: string;
  surprise: string;
  surprisePercentage: string;
}

interface TickerEarnings {
  annualEarnings: AnnualEarning[];
  quarterlyEarnings: QuarterlyEarning[];
}

export const getTickerEarnings = async (
  symbol: string,
): Promise<TickerEarnings> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Earnings,
    symbol: symbol.toUpperCase(),
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

export interface Income {
  fiscalDateEnding: string;
  grossProfit: string;
  totalRevenue: string;
  costOfRevenue: string;
  ebitda: string;
  netIncome: string;
}

interface TickerIncomes {
  annualReports: Income[];
  quarterlyReports: Income[];
}

export const getTickerIncomes = async (
  symbol: string,
): Promise<TickerIncomes> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Incomes,
    symbol: symbol.toUpperCase(),
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

interface IndicatorDateValue {
  date: string;
  value: string;
}

export const getRealGDP = async (
  interval: string,
): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.GDP,
    interval: interval,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getFundsRate = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.FundsRate,
    interval: 'monthly',
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getCPI = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.CPI,
    interval: 'monthly',
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getTreasuryYield = async (
  type: string,
): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.TreasuryYield,
    interval: 'monthly',
    maturity: type,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getInflation = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Inflation,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getInflationExpectation = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.InflationExpectation,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getConsumerSentiment = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.ConsumerSentiment,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getRetailSales = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.RetailSales,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getDurableGoods = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.DurableGoods,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getUnemploymentRate = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.UnemploymentRate,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getNonfarmPayroll = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.NonfarmPayroll,
    apikey: process.env.MARKET_KEY,
  })
  const url = `${BaseURL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}
