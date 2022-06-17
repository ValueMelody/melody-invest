import * as adapterEnum from 'enums/adapter'

export const generateTickerPricesKey = (date: string): string => {
  return `${adapterEnum.CacheKey.TickerPrices}-[${date}]`
}

export const generateSystemEndpointKey = (name: string): string => {
  return `${adapterEnum.CacheKey.SysemEndpoint}-[${name}]`
}

export const generatePayPalAccessTokenKey = (): string => {
  return adapterEnum.CacheKey.PayPalAccessToken
}
