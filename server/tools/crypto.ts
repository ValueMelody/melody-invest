import sha256 from 'crypto-js/sha256'

export const toSHA256 = (content: string): string => {
  return sha256(content).toString()
}
