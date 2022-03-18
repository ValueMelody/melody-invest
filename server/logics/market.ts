const PRICE_PADDING = 100

export const convertToIntPrice = (price: string): number => {
  const value = parseFloat(price)
  return Math.floor(value * PRICE_PADDING)
}

export const getSplitMultiplier = (
  splitCoefficient: string,
  previousDaily: ticker
) => {

}

export const getInitialCash = (): number => {
  return 100000 * PRICE_PADDING
}

export const getAdjustedClosePrice = (
  closePrice: string,
  splitCoefficient: string,
  previousClosePrice: number,
  previousAdjustedClosePrice: number,
): number => {
  const combinedClose = parseFloat(closePrice) * parseFloat(splitCoefficient)
  const differRatio = (combinedClose - previousClosePrice) / previousClosePrice
  const adjustedClose = previousAdjustedClosePrice * (1 + differRatio)
  return Math.floor(adjustedClose)
}

export const getDividendPercent = (
  dividendAmount: string,
  previousClose: number,
): string => {
  const dividend = parseFloat(dividendAmount)
  const ratio = dividend / previousClose
  return (ratio * 100).toFixed(2)
}
