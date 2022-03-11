import sha512 from 'crypto-js/sha512'
import md5 from 'crypto-js/md5'

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}

export const buildAccessHash = (digits: number): string => {
  const code = md5(Math.random().toString()).toString()
  return code.substring(0, digits)
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
