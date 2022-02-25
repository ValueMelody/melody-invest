import sha512 from 'crypto-js/sha512'

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}

export const pickOneInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

export const pickOneNumber = (first: number, second: number): number => {
  const value = pickOneInRange(1, 2)
  return value === 1 ? first : second
}
