import * as commonEnum from './common'

export const Nav = Object.freeze({
  Root: '/',
  Activation: '/activation',
  SignUp: '/sign-up',
  SignIn: '/sign-in',
  Setting: '/setting',
  Forgot: '/forgot-password',
  Reset: '/reset-password',
  Traders: '/traders',
  Behaviors: '/behaviors',
  Tickers: '/tickers',
  Dashboard: '/dashboard',
  NotFound: '/404',
  Pricing: '/pricing',
  Privacy: '/privacy',
  Terms: '/terms',
  Disclaimer: '/disclaimer',
  Limitations: '/limitations',
})

const base = `${commonEnum.Env.ServerType}://${commonEnum.Env.ServerHost}`

export const Endpoint = Object.freeze({
  Systems: `${base}/system`,
  Users: `${base}/users`,
  Traders: `${base}/traders`,
})
