import sha512 from 'crypto-js/sha512'

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}
