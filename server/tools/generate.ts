import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import sha256 from 'crypto-js/sha256'
import sha512 from 'crypto-js/sha512'
import md5 from 'crypto-js/md5'
import * as interfaces from '@shared/interfaces'
import * as emailEnum from '../enums/email'

export const toSHA256 = (content: string): string => {
  return sha256(content).toString()
}

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}

export const buildAccessHash = (digits: number): string => {
  const code = md5(Math.random().toString()).toString()
  return code.substring(0, digits)
}

export const buildEncryptedPassword = (password: string): string => {
  return toSHA256(toSHA512(password))
}

export const buildActivationCode = (): string => {
  return toSHA256(Math.random().toString())
}

export const encodeJWT = (
  auth: interfaces.request.Auth, expiresIn: '12h' | '30d',
): string => {
  const jwtToken = jwt.sign(
    auth, process.env.TOKEN_SECRET!, { expiresIn },
  )
  return jwtToken
}

export const decodeJWT = (token: string): interfaces.request.Auth | null => {
  const payload = jwt.verify(token, process.env.TOKEN_SECRET!)
  const id = typeof payload === 'object' && payload.id
  const email = typeof payload === 'object' && payload.email
  if (!id || !email) return null
  return { id, email }
}

export const getNumbersInRange = (min: number, max: number): number[] => {
  if (min >= max) throw new Error('min max less than max')
  const arr = []
  for (let i = min; i <= max; i++) {
    arr.push(i)
  }
  return arr
}

export const pickNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

export const pickOneNumber = (first: number, second: number): number => {
  const value = pickNumberInRange(1, 2)
  return value === 1 ? first : second
}

export const getChangePercent = (
  value: number,
  compareValue: number,
): number => {
  const differ = value - compareValue
  return Math.floor(differ * 10000 / compareValue)
}

export const sortNumsToString = (
  ids: number[],
): string => {
  return ids.sort((a, b) => a - b).join(',')
}

type EmailTypeKey = keyof typeof emailEnum.Type
type EmailTypeValue = typeof emailEnum.Type[EmailTypeKey]

export const buildEmail = (
  type: EmailTypeValue,
): string => {
  const location = path.resolve(__dirname, `../templates/${type}.html`)
  const template = fs.readFileSync(location, { encoding: 'utf-8' })
  return template
}
