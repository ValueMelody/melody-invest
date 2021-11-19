import axios from 'axios'
import qs from 'qs'
import * as marketEnum from '../enums/market'

const BASE_URL = 'https://www.alphavantage.co/query'

export const getCooldownPerMin = (): number => {
  return parseInt(process.env.MARKET_KEY_COOLDOWN!)
}

export const getTicketPrices = async (
  symbol: string
) => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.PRICES,
    symbol: symbol.toUpperCase(),
    outputsize: 'full',
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)
  return result.data
}

interface AnnualEarning {
  fiscalDateEnding: string;
  reportedEPS: string;
}

interface quarterlyEarning {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: string;
  estimatedEPS: string;
  surprise: string;
  surprisePercentage: string;
}

interface TicketEarnings {
  annualEarnings: AnnualEarning[];
  quarterlyEarnings: quarterlyEarning[];
}

export const getTicketEarnings = async (
  symbol: string
): Promise<TicketEarnings> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.EARNINGS,
    symbol: symbol.toUpperCase(),
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

interface Income {
  fiscalDateEnding: string;
  grossProfit: string;
  totalRevenue: string;
  costOfRevenue: string;
  ebitda: string;
  netIncome: string;
}

interface TicketIncomes {
  annualReports: Income[];
  quarterlyReports: Income[];
}

export const getTicketIncomes = async (
  symbol: string
): Promise<TicketIncomes> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.INCOMES,
    symbol: symbol.toUpperCase(),
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

interface IndicatorDateValue {
  date: string;
  value: string;
}

export const getRealGDP = async (
  interval: string
): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.GDP,
    interval: interval,
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getFundsRate = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.FUNDS_RATE,
    interval: 'monthly',
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getCPI = async (): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.CPI,
    interval: 'monthly',
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getTreasuryYield = async (
  type: string
): Promise<{
  data: IndicatorDateValue[]
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.TREASURY_YIELD,
    interval: 'monthly',
    maturity: type,
    apikey: process.env.MARKET_KEY
  })
  const url = `${BASE_URL}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}
