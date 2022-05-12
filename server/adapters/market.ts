import axios from 'axios'
import qs from 'qs'
import * as marketEnum from '../enums/market'

export const getEnv = () => {
  return {
    key: process.env.MARKET_KEY!,
    cooldownSeconds: parseInt(process.env.MARKET_KEY_COOLDOWN!),
    baseUrl: 'https://www.alphavantage.co/query',
  }
}

export const getCooldownPerMin = (): number => {
  const env = getEnv()
  return env.cooldownSeconds || 15
}

export const getTickerPrices = async (
  symbol: string,
) => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.Prices,
    symbol: symbol.toUpperCase(),
    outputsize: 'full',
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
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
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.Earnings,
    symbol: symbol.toUpperCase(),
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
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
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.Incomes,
    symbol: symbol.toUpperCase(),
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
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
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.GDP,
    interval: interval,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getFundsRate = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.FundsRate,
    interval: 'monthly',
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getCPI = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.CPI,
    interval: 'monthly',
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getTreasuryYield = async (
  type: string,
): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.TreasuryYield,
    interval: 'monthly',
    maturity: type,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getInflation = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.Inflation,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getInflationExpectation = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.InflationExpectation,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getConsumerSentiment = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.ConsumerSentiment,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getRetailSales = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.RetailSales,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getDurableGoods = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.DurableGoods,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getUnemploymentRate = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.UnemploymentRate,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getNonfarmPayroll = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const env = getEnv()
  const queryParams = qs.stringify({
    function: marketEnum.Type.NonfarmPayroll,
    apikey: env.key,
  })
  const url = `${env.baseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}
