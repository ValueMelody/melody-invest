export const convertToIntPrice = (price: string | number): number => {
  const floatPrice = typeof price === 'number' ? price : parseFloat(price)
  return Math.floor(floatPrice * 10000)
}

export const getAdjustedClosePrice = (
  closePrice: string,
  splitCoefficient: string,
  previousClosePrice: string,
  previousAdjustedClosePrice: number,
): number => {
  const combinedClose = parseFloat(closePrice) * parseFloat(splitCoefficient)
  const previousClose = parseFloat(previousClosePrice)
  const differRatio = (combinedClose - previousClose) / previousClose
  const adjustedClose = previousAdjustedClosePrice * (1 + differRatio)
  return Math.floor(adjustedClose)
}

export const getDividendPercent = (
  dividendAmount: string,
  previousClosePrice: string,
): string => {
  const dividend = parseFloat(dividendAmount)
  const previousClose = parseFloat(previousClosePrice)
  const ratio = dividend / previousClose
  return (ratio * 100).toFixed(2)
}
