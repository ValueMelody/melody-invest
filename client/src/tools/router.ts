import * as routerEnum from '../enums/router'

export const tickerListRoute = (): string => {
  return routerEnum.NAV.TICKERS
}

export const tickerDetailRoute = (envId: number, tickerId: number): string => {
  return `${routerEnum.NAV.TICKERS}/${tickerId}/envs/${envId}`
}

export const behaviorDetailRoute = (envId: number, behavior: string): string => {
  return `${routerEnum.NAV.BEHAVIORS}/${behavior}/envs/${envId}`
}

export const behaviorListRoute = (): string => {
  return routerEnum.NAV.BEHAVIORS
}

export const profileDetailRoute = (id: number, accessCode: string): string => {
  return `${routerEnum.NAV.TRADERS}/profiles/${id}/${accessCode}`
}

export const profileBuildRoute = (): string => {
  return `${routerEnum.NAV.TRADERS}/profiles/build`
}

export const envDetailRoute = (id: number): string => {
  return `${routerEnum.NAV.TRADERS}/envs/${id}`
}

export const envBuildRoute = (): string => {
  return `${routerEnum.NAV.TRADERS}/envs/build`
}

export const comboBuildRoute = (): string => {
  return `${routerEnum.NAV.TRADERS}/combos/build`
}

export const comboDetailRoute = (id: number): string => {
  return `${routerEnum.NAV.TRADERS}/combos/${id}`
}

export const dashboardRoute = (): string => {
  return routerEnum.NAV.DASHBOARD
}

export const topProfilesRoute = (): string => {
  return `${routerEnum.NAV.TRADERS}/profiles/tops`
}

export const topCombosRoute = (): string => {
  return `${routerEnum.NAV.TRADERS}/combos/tops`
}

export const signInRoute = (): string => {
  return routerEnum.NAV.SIGN_IN
}

export const settingRoute = (): string => {
  return routerEnum.NAV.SETTING
}

export const notFoundRoute = (): string => {
  return routerEnum.NAV.NOT_FOUND
}
