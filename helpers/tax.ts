import * as constants from '@shared/constants'

export const getTaxAmount = (
  price: string,
  stateCode: string,
  provinceCode: string,
) => {
  const percentage = stateCode === 'CA' && provinceCode
    ? constants.User.BillingTax.State.CA.Province[
      provinceCode as keyof typeof constants.User.BillingTax.State.CA.Province
    ]
    : 0
  const tax = Math.round(parseFloat(price) * percentage * 100) / 100
  return tax.toFixed(2)
}
