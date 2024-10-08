import * as routerEnum from 'enums/router'

export const tickerListRoute = (): string => {
  return routerEnum.Nav.Tickers
}

export const behaviorDetailRoute = (envId: number, behavior: string): string => {
  return `${routerEnum.Nav.Behaviors}/${behavior}/envs/${envId}`
}

export const behaviorListRoute = (): string => {
  return routerEnum.Nav.Behaviors
}

export const profileDetailRoute = (id: number, accessCode: string): string => {
  return `${routerEnum.Nav.Traders}/profiles/${id}/${accessCode}`
}

export const profileBuildRoute = (): string => {
  return `${routerEnum.Nav.Traders}/profiles/build`
}

export const envDetailRoute = (id: number): string => {
  return `${routerEnum.Nav.Traders}/envs/${id}`
}

export const envBuildRoute = (): string => {
  return `${routerEnum.Nav.Traders}/envs/build`
}

export const comboBuildRoute = (): string => {
  return `${routerEnum.Nav.Traders}/combos/build`
}

export const comboDetailRoute = (id: number): string => {
  return `${routerEnum.Nav.Traders}/combos/${id}`
}

export const dashboardRoute = (): string => {
  return routerEnum.Nav.Dashboard
}

export const signInRoute = (): string => {
  return routerEnum.Nav.SignIn
}

export const settingRoute = (): string => {
  return routerEnum.Nav.Setting
}

export const notFoundRoute = (): string => {
  return routerEnum.Nav.NotFound
}

export const signUpRoute = (): string => {
  return routerEnum.Nav.SignUp
}

export const forgotRoute = (): string => {
  return routerEnum.Nav.Forgot
}

export const resetRoute = (): string => {
  return routerEnum.Nav.Reset
}

export const privacyRoute = (): string => {
  return routerEnum.Nav.Privacy
}

export const termsRoute = (): string => {
  return routerEnum.Nav.Terms
}

export const disclaimerRoute = (): string => {
  return routerEnum.Nav.Disclaimer
}

export const limitationsRoute = (): string => {
  return routerEnum.Nav.Limitations
}

export const rootRoute = (): string => {
  return routerEnum.Nav.Root
}
