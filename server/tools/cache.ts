import * as cacheEnum from '../enums/cache'

export const generateTickerPricesKey = (date: string): string => {
  return `${cacheEnum.BASE_KEY.TICKER_PRICES}{${date}}`
}
