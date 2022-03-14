export const NAV = {
  SIGNUP: '/sign-up',
  SIGNIN: '/sign-in',
  TOP_PROFILES: '/top-profiles',
  PROFILES: '/profiles',
  NOT_FOUND: '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  TICKER_PROFILES: `${base}/ticker-profiles`,
  TRADER_PROFILES: `${base}/trader-profiles`,
}
