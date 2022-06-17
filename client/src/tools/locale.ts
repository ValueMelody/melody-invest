import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enResource from 'locales/en.json'

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
