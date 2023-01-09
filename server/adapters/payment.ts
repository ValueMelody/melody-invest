
import * as adapterEnum from 'enums/adapter'
import axios from 'axios'

export const getOrderDetail = async (
  orderId: string,
) => {
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/checkout/orders/${orderId}`
  const result = await axios.get(url, {
    headers: {
      Authorization: `Basic ${adapterEnum.PaymentConfig.ClientId}:${adapterEnum.PaymentConfig.ClientSecret}`,
    },
  })
  return result.data
}
