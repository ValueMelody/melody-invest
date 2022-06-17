import axios from 'axios'
import qs from 'qs'
import * as adapterEnum from 'enums/adapter'
import * as errorEnum from 'enums/error'
import * as cacheTool from 'tools/cache'
import * as cacheAdapter from './cache'

export const createAccessToken = async () => {
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/oauth2/token`
  const result = await axios.post(
    url,
    qs.stringify({ grant_type: 'client_credentials' }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: adapterEnum.PaymentConfig.ClientId,
        password: adapterEnum.PaymentConfig.ClientSecret,
      },
    },
  )
  return {
    accessToken: result?.data?.access_token || '',
    expiresIn: result?.data?.expires_in || 0,
  }
}

const getAccessToken = async () => {
  const key = cacheTool.generatePayPalAccessTokenKey()
  const stored = await cacheAdapter.get(key)
  if (stored) return stored
  const accessResult = await createAccessToken()
  if (!accessResult.accessToken) throw errorEnum.Custom.PayPalServerError
  const hours = Math.floor(accessResult.expiresIn / 3600) - 1
  await cacheAdapter.set(key, accessResult.accessToken, `${hours}h`)
  return accessResult.accessToken
}

export const getSubscriptionDetail = async (
  subscriptionId: string,
) => {
  const accessToken = await getAccessToken()
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/billing/subscriptions/${subscriptionId}`
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return result.data
}

export const cancelSubscription = async (
  subscriptionId: string,
) => {
  const accessToken = await getAccessToken()
  const url = `${adapterEnum.PaymentConfig.BaseUrl}/billing/subscriptions/${subscriptionId}/cancel`
  await axios.post(
    url,
    { reason: 'Cancalled by user' },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}
