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
  annualEarnings: AnnualEarning[]
  quarterlyEarnings: quarterlyEarning[]
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
  annualReports: Income[]
  quarterlyReports: Income[]
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

const getRealGdp = async (
  interval: string
) => {
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

export const getRealGdpYearly = async () => {
  return getRealGdp(marketEnum.INTERVAL.YEARLY)
}

export const getRealGdpQuarterly = async () => {
  return getRealGdp(marketEnum.INTERVAL.QUARTERLY)
}
