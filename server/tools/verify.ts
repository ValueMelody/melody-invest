export const isEmail = (email: string): boolean => {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regx.test(email)
}

export const isGreaterThanZero = (value: number): boolean => {
  return value > 0
}
