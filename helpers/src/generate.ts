import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import md5 from 'crypto-js/md5'
import sha256 from 'crypto-js/sha256'
import sha512 from 'crypto-js/sha512'

export const toSHA256 = (content: string): string => {
  return sha256(content).toString()
}

export const toSHA512 = (content: string): string => {
  return sha512(content).toString()
}

export const toMD5 = (content: string): string => {
  return md5(content).toString()
}

const BehaviorGroups: interfaces.traderPatternModel.Behavior[][] = [
  constants.Behavior.BuyBehaviors,
  constants.Behavior.SellBehaviors,
  ['cashMaxPercent'],
  ['tickerMinPercent'],
  ['tickerMaxPercent'],
  ['holdingBuyPercent'],
  ['holdingSellPercent'],
  ['tradeFrequency'],
  ['rebalanceFrequency'],
  ['buyPreference'],
  ['sellPreference'],
]

export const toPatternHashCode = (
  pattern: object,
): string => {
  const template = BehaviorGroups.map((group) => group.map((behavior) => {
    return pattern[behavior] === undefined ? null : pattern[behavior]
  }))
  return toSHA512(JSON.stringify(template))
}
