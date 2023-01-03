import * as adapterEnum from 'enums/adapter'
import * as emailEnum from 'enums/email'
import * as interfaces from '@shared/interfaces'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import md5 from 'crypto-js/md5'
import path from 'path'
import sha256 from 'crypto-js/sha256'
import sha512 from 'crypto-js/sha512'

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

export const buildAccessCode = (): string => {
  return toSHA256(Math.random().toString())
}

export const encodeJWT = (
  auth: interfaces.request.Auth,
  expiresIn: '15m' | '12h' | '30d',
  isRefreshToken = false,
): string => {
  const secret = isRefreshToken ? adapterEnum.HostConfig.RefreshTokenSecret : adapterEnum.HostConfig.AccessTokenSecret
  const jwtToken = jwt.sign(
    auth, secret, { expiresIn },
  )
  return jwtToken
}

export const decodeJWT = (
  token: string,
  isRefreshToken: boolean,
): interfaces.request.Auth | null => {
  const secret = isRefreshToken ? adapterEnum.HostConfig.RefreshTokenSecret : adapterEnum.HostConfig.AccessTokenSecret
  const payload = jwt.verify(token, secret)
  const id = typeof payload === 'object' && payload.id
  const email = typeof payload === 'object' && payload.email
  const type = typeof payload === 'object' && payload.type
  if (!id || !email || !type) return null
  return { id, email, type }
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

export const buildEmailContent = (
  type: EmailTypeValue,
  options?: interfaces.common.StringOption[],
): string => {
  const location = path.resolve(__dirname, `../templates/${type}.html`)
  let template = fs.readFileSync(location, { encoding: 'utf-8' })
  options?.forEach((option) => {
    template = template.replace(`{{{${option.label}}}}`, option.value)
  })
  return template
}
