export const getAdjustedClosePrice = (
  closePrice: string,
  splitCoefficient: string,
  previousClosePrice: string,
  previousAdjustedClosePrice: string
): string => {
  const previousClose = parseFloat(previousClosePrice)
  const combinedClose = parseFloat(closePrice) * parseFloat(splitCoefficient)
  const differRatio = (combinedClose - previousClose) / previousClose
  const adjustedClose = parseFloat(previousAdjustedClosePrice) * (1 + differRatio)
  return adjustedClose.toFixed(2)
}

export const getDividendPercent = (
  dividendAmount: string,
  previousClosePrice: string
): string => {
  const dividend = parseFloat(dividendAmount)
  const previousClose = parseFloat(previousClosePrice)
  const ratio = dividend / previousClose
  return (ratio * 100).toFixed(2)
}
