export enum Nav {
  SignUp = '/sign-up',
  SignIn = '/sign-in',
  Setting = '/setting',
  Traders = '/traders',
  Behaviors = '/behaviors',
  Tickers = '/tickers',
  Dashboard = '/dashboard',
  NotFound = '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const Endpoint = Object.freeze({
  Systems: `${base}/system`,
  Users: `${base}/users`,
  Traders: `${base}/traders`,
})
