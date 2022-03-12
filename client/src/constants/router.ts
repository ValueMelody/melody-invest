export const NAV = {
  TOP_PROFILES: '/top-profiles',
  PROFILES: '/profiles',
  NOT_FOUND: '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  TRADER_PROFILES: `${base}/trader-profiles`,
}
