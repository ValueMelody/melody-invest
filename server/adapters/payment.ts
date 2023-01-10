
import * as adapterEnum from 'enums/adapter'
import axios from 'axios'

const buildAuth = () => {
  const token = Buffer.from(
    `${adapterEnum.PaymentConfig.ClientId}:${adapterEnum.PaymentConfig.ClientSecret}`,
  ).toString('base64')
  return `Basic ${token}`
}

export const getOrderDetail = async (
  orderId: string,
) => {
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/checkout/orders/${orderId}`
  const result = await axios.get(url, {
    headers: {
      Authorization: buildAuth(),
    },
  })
  return result.data
}

export const captureOrderPayment = async (
  orderId: string,
) => {
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/checkout/orders/${orderId}/capture`
  const result = await axios.post(url, undefined, {
    headers: {
      Authorization: buildAuth(),
      'Content-Type': 'application/json',
    },
  })
  return result.data
}
