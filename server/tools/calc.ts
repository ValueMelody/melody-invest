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
