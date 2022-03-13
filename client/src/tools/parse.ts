import * as localeTool from './locale'

export const dbPercentNumber = (value: number | null): string => {
  if (value === null) return ''
  return `${value / 100}%`
}

export const dbPercent = (value: number | null): string => {
  if (value === null) return ''
  return `${value}%`
}

export const patternFrequency = (value: number | null): string => {
  if (value === null) return ''
  return localeTool.t('behavior.frequency.type', { num: value })
}

export const patternPreference = (value: number | null): string => {
  if (value === null) return ''
  if (value >= 1 && value <= 22) {
    const localeKey = `behavior.preference.type.${value}`
    return localeTool.t(localeKey)
  }
  return ''
}

export const holdingValue = (value: number | null): string | null => {
  if (value === null) return null
  return (value / 10000).toFixed(2)
}

export const floatToPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`
}
