import * as interfaces from '@shared/interfaces'
import * as localeTool from './locale'

export const dbPercentNumber = (value: number | null): string => {
  if (value === null) return ''
  return `${value / 100}%`
}

export const dbPercent = (value: number | null): string => {
  if (value === null) return ''
  return `${value}%`
}

const patternFrequency = (value: number | null): string => {
  if (value === null) return ''
  return localeTool.t('behavior.frequency.type', { num: value })
}

const patternPreference = (value: number | null): string => {
  if (value === null) return ''
  if (value >= 1 && value <= 22) {
    const localeKey = `behavior.preference.type.${value}`
    return localeTool.t(localeKey)
  }
  return ''
}

export const behaviorValue = (
  behavior: interfaces.traderPatternModel.Behavior,
  value: number | null,
): string | number | null => {
  if (!value) return ''
  if (behavior.includes('Percent')) return dbPercent(value)
  if (behavior.includes('Frequency')) return patternFrequency(value)
  if (behavior.includes('Preference')) return patternPreference(value)
  return value
}

export const behaviorTitle = (behavior: interfaces.traderPatternModel.Behavior) => {
  return localeTool.t(`behaviorTitle.${behavior}`)
}

export const behaviorDesc = (behavior: interfaces.traderPatternModel.Behavior) => {
  return localeTool.t(`behaviorDesc.${behavior}`)
}

export const traderEnvName = (
  traderEnv: interfaces.traderEnvModel.Record | null,
) => {
  if (!traderEnv) return ''
  return traderEnv.name ? localeTool.t(`traderEnvName.${traderEnv.name}`) : ''
}

export const traderEnvStartDate = (traderEnv: interfaces.traderEnvModel.Record) => {
  return localeTool.t('traderEnv.startAt', { date: traderEnv.startDate })
}

export const traderEnvTickers = (traderEnv: interfaces.traderEnvModel.Record) => {
  if (!traderEnv.tickerIds) return localeTool.t('traderEnv.allTickers')
  return localeTool.t('traderEnv.selectedTickers', { num: traderEnv.tickerIds.length })
}

export const holdingValue = (value: number | null): string | null => {
  if (value === null) return null
  const realValue = value / 100
  return Intl
    ? new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(realValue)
    : (realValue).toFixed(2)
}

export const floatToPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`
}
