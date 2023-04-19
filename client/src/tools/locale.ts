import enResource from 'locales/en.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const init = () => i18n
  .use(initReactI18next)
  .init({
    resources: { en: enResource },
    lng: 'en',
    returnEmptyString: false,
    interpolation: {
      escapeValue: false,
    },
  })

init()

export const t = i18n.t

export const getStateName = (code: string) => {
  return t(`state.${code}`)
}

export const getProvinceName = (stateCode: string, code: string) => {
  return t(`province.${stateCode}.${code}`)
}

export const getTickerName = (symbol: string | undefined) => {
  if (!symbol) return ''
  const key = `symbol.${symbol}`
  const translation = t(`symbol.${symbol}`)
  return key === translation ? symbol : translation
}
