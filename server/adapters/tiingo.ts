import * as generateTool from 'tools/generate'
import axios from 'axios'
import qs from 'qs'

const TiingoBaseUrl = 'https://api.tiingo.com/tiingo/'

export interface TiingoPrice {
  date: string;
  close: number;
  volume: number;
  splitFactor: number;
}

export const getTickerPrices = async (
  symbol: string,
  startDate: string,
  endDate: string,
  dataKey: string,
): Promise<TiingoPrice[]> => {
  const queryParams = qs.stringify({
    token: generateTool.decodeDataKey(dataKey),
    startDate,
    endDate,
  })
  const url = `${TiingoBaseUrl}/daily/${symbol}/prices?${queryParams}`
  const result = await axios.get(url)

  if (!result?.data) throw new Error('Price data not exists')

  return result.data
}
