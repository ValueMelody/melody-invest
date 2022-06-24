import * as commonEnum from 'enums/common'

type KeyIndex = keyof typeof commonEnum.StorageKey
type KeyType = typeof commonEnum.StorageKey[KeyIndex]

export const set = (key: KeyType, value: string) => {
  localStorage.setItem(key, value)
}

export const get = (key: KeyType): string | null => {
  return localStorage.getItem(key)
}

export const remove = (key: KeyType) => {
  localStorage.removeItem(key)
}
