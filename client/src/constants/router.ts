export const NAV = {
  TOP_PATTERNS: 'top-patterns',
}

const base = `${process.env.REACT_APP_SERVER_TYPE}://${process.env.REACT_APP_SERVER_HOST}`

export const API = {
  PATTERNS: `${base}/patterns`,
}
