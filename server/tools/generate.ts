import sha512 from 'crypto-js/sha512'

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}

export const pickNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

export const pickOneNumber = (first: number, second: number): number => {
  const value = pickNumberInRange(1, 2)
  return value === 1 ? first : second
}

export const getChangePercent = (value: number, compareValue: number): number => {
  const differ = value - compareValue
  return Math.floor(differ * 10000 / compareValue)
}
