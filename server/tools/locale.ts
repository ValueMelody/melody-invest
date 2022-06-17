import enLocale from 'locales/en.json'

export const getTranslation = (
  name: keyof typeof enLocale.translation,
): string => {
  return enLocale.translation[name] || ''
}
