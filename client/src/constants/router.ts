export const NAV = {
  TOP_TRADERS: '/top-patterns',
  TRADERS: '/patterns',
  NOT_FOUND: '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  TRADERS: `${base}/traders`,
}
