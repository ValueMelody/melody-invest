export const NAV = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  SETTING: '/setting',
  TOP_PROFILES: '/top-profiles',
  PROFILES: '/profiles',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  SYSTEMS: `${base}/system`,
  USERS: `${base}/users`,
  TICKERS: `${base}/tickers`,
  TRADERS: `${base}/traders`,
}
