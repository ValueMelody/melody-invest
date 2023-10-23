import * as adapterEnum from 'enums/adapter'

export const generateDailyTickersKey = (entityId: number, date: string): string => {
  return `${adapterEnum.CacheKey.DailyTickers}-[${entityId}+${date}]`
}

export const generateDailyIndicatorsKey = (date: string): string => {
  return `${adapterEnum.CacheKey.DailyIndicators}-${date}]`
}

export const generateTickerPricesKey = (entityId: number, date: string): string => {
  return `${adapterEnum.CacheKey.TickerPrices}-[${entityId}+${date}]`
}

export const generateSystemEndpointKey = (name: string): string => {
  return `${adapterEnum.CacheKey.SysemEndpoint}-[${name}]`
}
