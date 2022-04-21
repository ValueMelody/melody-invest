import * as adapterEnum from '../enums/adapter'

export const generateTickerPricesKey = (date: string): string => {
  return `${adapterEnum.CacheKey.TickerPrices}{${date}}`
}
