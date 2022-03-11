export const NAV = {
  TOP_PATTERNS: '/top-patterns',
  PATTERNS: '/patterns',
  NOT_FOUND: '/404',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  RESOURCES: `${base}/resources`,
  TRADERS: `${base}/traders`,
}
