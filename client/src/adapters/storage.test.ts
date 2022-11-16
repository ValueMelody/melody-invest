import * as commonEnum from 'enums/common'
import * as storage from './storage'

describe('#get', () => {
  test('could get', () => {
    expect(storage.get(commonEnum.StorageKey.AuthToken)).toBe(null)
  })
})

describe('#set', () => {
  test('could set', () => {
    storage.set(commonEnum.StorageKey.AuthToken, '111')
    expect(storage.get(commonEnum.StorageKey.AuthToken)).toBe('111')

    storage.set(commonEnum.StorageKey.AuthToken, '222')
    expect(storage.get(commonEnum.StorageKey.AuthToken)).toBe('222')
  })
})

describe('#remove', () => {
  test('could remove', () => {
    storage.set(commonEnum.StorageKey.AuthToken, '333')
    expect(storage.get(commonEnum.StorageKey.AuthToken)).toBe('333')
    storage.remove(commonEnum.StorageKey.AuthToken)
    expect(storage.get(commonEnum.StorageKey.AuthToken)).toBe(null)
  })
})
