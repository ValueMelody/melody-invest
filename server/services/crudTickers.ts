import * as interfaces from '@shared/interfaces'
import * as tickerModel from '../models/ticker'

export const getTickerIdentities = async (): Promise<interfaces.tickerRes.TickerIdentity[]> => {
  const tickers = await tickerModel.getAll()
  return tickers.map((ticker) => ({
    id: ticker.id,
    name: ticker.name,
    region: ticker.region,
    symbol: ticker.symbol,
  }))
}
