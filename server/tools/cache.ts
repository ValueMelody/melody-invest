import * as adapterEnum from 'enums/adapter'

export const generateDailyTickersKey = (date: string): string => {
  return `${adapterEnum.CacheKey.DailyTickers}-[${date}]`
}

export const generateTickerPricesKey = (date: string): string => {
  return `${adapterEnum.CacheKey.TickerPrices}-[${date}]`
}

export const generateSystemEndpointKey = (name: string): string => {
  return `${adapterEnum.CacheKey.SysemEndpoint}-[${name}]`
}
