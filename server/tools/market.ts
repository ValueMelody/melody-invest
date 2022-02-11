export const getAdjustedClosePrice = (
  closePrice: string,
  splitCoefficient: string,
  previousClosePrice: number,
  previousAdjustedClosePrice: number
): string => {
  const combinedClose = parseFloat(closePrice) * parseFloat(splitCoefficient)
  const differRatio = (combinedClose - previousClosePrice) / previousClosePrice
  const adjustedClose = previousAdjustedClosePrice * (1 + differRatio)
  return adjustedClose.toFixed(2)
}

export const getDividendPercent = (
  dividendAmount: string,
  previousClosePrice: number
): string => {
  const dividend = parseFloat(dividendAmount)
  const ratio = dividend / previousClosePrice
  return (ratio * 100).toFixed(2)
}
