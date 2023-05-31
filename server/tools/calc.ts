import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export const calcBookValue = (totalAssets: number | null, totalLiabilities: number | null) => {
  return totalAssets !== null && totalLiabilities !== null
    ? totalAssets - totalLiabilities
    : null
}

export const calcPbRatio = (
  closePrice: number | null,
  bookValue: number | null,
  outstandingShares: number | null,
) => {
  return closePrice && bookValue && outstandingShares
    ? (closePrice / (bookValue / outstandingShares)).toFixed(2)
    : null
}

export const calcPeRatio = (
  closePrice: number | null,
  eps: number | null,
) => {
  return closePrice && eps
    ? (closePrice / eps).toFixed(2)
    : null
}

export const calcPsRatio = (
  closePrice: number | null,
  totalRevenue: number | null,
  outstandingShares: number | null,
) => {
  return closePrice && totalRevenue && outstandingShares
    ? ((closePrice * outstandingShares) / totalRevenue).toFixed(2)
    : null
}

export const calcQoQChangePercent = (
  currentValue: number | null,
  pastValue: number | null | undefined,
) => {
  return currentValue !== null && pastValue !== null && pastValue !== undefined
    ? ((currentValue - pastValue) * 100 / pastValue).toFixed(2)
    : null
}

export const calcChangePercent = (
  currentValue: number | null,
  pastValue: number | null | undefined,
) => {
  return currentValue !== null && pastValue !== null && pastValue !== undefined
    ? (currentValue - pastValue) * 100 / pastValue
    : null
}

export const calcIncreaseDecreaseValues = (
  currentValue: number | null,
  lastValue: number | null | undefined,
  lastIncrease: number | null | undefined,
  lastDecrease: number | null | undefined,
) => {
  let increaseValue = null
  let decreaseValue = null
  if (currentValue !== null && lastValue !== null && lastValue !== undefined) {
    const baseIncrease = lastIncrease || 0
    increaseValue = currentValue > lastValue ? baseIncrease + 1 : 0
    const baseDecrease = lastDecrease || 0
    decreaseValue = currentValue < lastValue ? baseDecrease + 1 : 0
  }

  return { increaseValue, decreaseValue }
}

export const calcIndicatorInfo = (
  indicatorMonthly: interfaces.indicatorMonthlyModel.Record | null,
  indicatorQuarterly: interfaces.indicatorQuarterlyModel.Record | null,
  indicatorYearly: interfaces.indicatorYearlyModel.Record | null,
): interfaces.dailyIndicatorsModel.IndicatorInfo => {
  const info: interfaces.dailyIndicatorsModel.IndicatorInfo = {}
  if (indicatorMonthly) {
    constants.Indicator.IndicatorMonthlyMovementKeys.forEach((key) => {
      info[key] = indicatorMonthly[key]
    })
    constants.Indicator.IndicatorMonthlyCompareKeys.forEach((key) => {
      info[key] = indicatorMonthly[key]
    })
  }

  if (indicatorQuarterly) {
    constants.Indicator.IndicatorQuarterlyMovementKeys.forEach((key) => {
      info[key] = indicatorQuarterly[key]
    })
    constants.Indicator.IndicatorQuarterlyCompareKeys.forEach((key) => {
      info[key] = indicatorQuarterly[key]
    })
  }

  if (indicatorYearly) {
    constants.Indicator.IndicatorYearlyMovementKeys.forEach((key) => {
      info[key] = indicatorYearly[key]
    })
    constants.Indicator.IndicatorYearlyCompareKeys.forEach((key) => {
      info[key] = indicatorYearly[key]
    })
  }

  return info
}
