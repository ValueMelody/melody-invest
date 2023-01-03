import * as commonEnum from 'enums/common'
import * as storage from './storage'

describe('#get', () => {
  test('could get', () => {
    expect(storage.get(commonEnum.StorageKey.AccessToken)).toBe(null)
  })
})

describe('#set', () => {
  test('could set', () => {
    storage.set(commonEnum.StorageKey.AccessToken, '111')
    expect(storage.get(commonEnum.StorageKey.AccessToken)).toBe('111')

    storage.set(commonEnum.StorageKey.AccessToken, '222')
    expect(storage.get(commonEnum.StorageKey.AccessToken)).toBe('222')
  })
})

describe('#remove', () => {
  test('could remove', () => {
    storage.set(commonEnum.StorageKey.AccessToken, '333')
    expect(storage.get(commonEnum.StorageKey.AccessToken)).toBe('333')
    storage.remove(commonEnum.StorageKey.AccessToken)
    expect(storage.get(commonEnum.StorageKey.AccessToken)).toBe(null)
  })
})
