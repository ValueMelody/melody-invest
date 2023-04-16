import * as adapterEnum from 'enums/adapter'
import * as constants from '@shared/constants'
import * as emailEnum from 'enums/email'
import * as helpers from '@shared/helpers'
import * as interfaces from '@shared/interfaces'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'

export const buildAccessHash = (digits: number): string => {
  const code = helpers.toMD5(Math.random().toString())
  return code.substring(0, digits)
}

export const buildEncryptedPassword = (password: string): string => {
  return helpers.toSHA256(helpers.toSHA512(password))
}

export const buildAccessCode = (): string => {
  return helpers.toSHA256(Math.random().toString())
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
  const entityId = typeof payload === 'object' && payload.entityId
  const email = typeof payload === 'object' && payload.email
  const type = typeof payload === 'object' && payload.type
  if (!id || !email || !type) return null
  return { id, entityId, email, type }
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

export const getEmailStatus = (response: SMTPTransport.SentMessageInfo | undefined, email: string) => {
  return response?.accepted?.length && response.accepted[0] === email
    ? constants.Email.Status.Completed
    : constants.Email.Status.Failed
}
