export const KEYS = {
  JWT_TOKEN: 'jwtToken',
}

type KeyIndex = keyof typeof KEYS
type Key = typeof KEYS[KeyIndex]

export const set = (key: Key, value: string) => {
  window.localStorage.setItem(key, value)
}

export const get = (key: string): string | null => {
  return localStorage.getItem(key)
}
