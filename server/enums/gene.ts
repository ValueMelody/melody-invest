export const DAYS = {
  WEEK: 5,
  HALF_MONTH: 10,
  MONTH: 20,
  HALF_QUARTER: 40,
  QUARTER: 80,
  HALF_YEAR: 160,
  YEAR: 320,
}

export const VALUES = {
  MOVEMENT_VALUE: [1, 2, 3, 5],
  CASH_MAX_PERCENT: [0, 10, 20, 30, 50, 80, 100],
  PORTFOLIO_PERCENT: [1, 2, 3, 5, 8, 13, 21, 34, 55],
  HOLDING_PERCENT: [20, 40, 60, 80, 100],
  TRADE_FREQUENCY: [
    1, 2, 3, DAYS.WEEK,
    DAYS.HALF_MONTH, DAYS.MONTH,
    DAYS.HALF_QUARTER, DAYS.QUARTER,
    DAYS.HALF_YEAR, DAYS.YEAR,
  ],
  REBALANCE_FREQUENCY: [
    0, DAYS.WEEK,
    DAYS.HALF_MONTH, DAYS.MONTH,
    DAYS.HALF_QUARTER, DAYS.QUARTER,
    DAYS.HALF_YEAR, DAYS.YEAR,
  ],
  GDP_CHANGE_PERCENT: [-5, -3, -2, -1, 1, 2, 3, 5],
}
