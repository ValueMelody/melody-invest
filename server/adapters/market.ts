import axios from 'axios'
import qs from 'qs'
import * as marketEnum from '../enums/market'

const BASE_URL = 'https://www.alphavantage.co/query'

export const getTicketDailyAdjusted = async (
  symbol: string
) => {
  const queryParams = qs.stringify({
    function: marketEnum.TYPES.DAILY_ADJUSTED,
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
  return result.data
}
