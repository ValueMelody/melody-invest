import axios from 'axios'
import qs from 'qs'
import { TYPES } from '../enums/market'

const baseUrl = 'https://www.alphavantage.co/query'

export const getTicketDailyAdjusted = async (symbol: string) => {
  const queryParams = qs.stringify({
    function: TYPES.DAILY_ADJUSTED,
    symbol: symbol.toUpperCase(),
    outputsize: 'full',
    apikey: process.env.MARKET_KEY
  })
  const url = `${baseUrl}?${queryParams}`
  const result = await axios.get(url)
  return result.data
}
