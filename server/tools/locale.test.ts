import enLocale from 'locales/en.json'
import * as locale from './locale'

describe('#getTranslation', () => {
  test('could get translation', () => {
    expect(Object.keys(enLocale.translation).length).not.toBe(0)
    const translationKeys = Object.keys(
      enLocale.translation,
    ) as Array<keyof typeof enLocale.translation>

    translationKeys.forEach((key) => {
      expect(locale.getTranslation(key).length).not.toBe(0)
    })
  })
})
