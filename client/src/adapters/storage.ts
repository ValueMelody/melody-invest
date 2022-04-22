export const Key = Object.freeze({
  JWTToken: 'jwtToken',
  UserType: 'userType',
})

type KeyIndex = keyof typeof Key
type KeyType = typeof Key[KeyIndex]

export const set = (key: KeyType, value: string) => {
  window.localStorage.setItem(key, value)
}

export const get = (key: KeyType): string | null => {
  return localStorage.getItem(key)
}

export const remove = (key: KeyType) => {
  localStorage.removeItem(key)
}
