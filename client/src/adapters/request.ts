import * as commonEnum from 'enums/common'
import * as localeTool from 'tools/locale'
import axios from 'axios'

axios.defaults.headers.common[
  'Access-Control-Allow-Origin'
] = `${commonEnum.Env.ServerType}://${commonEnum.Env.ServerHost}`

export const setAuthToken = (token: string) => {
  if (!token) {
    axios.defaults.headers.common.Authorization = ''
  } else {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

export const sendGetRequest = async (endpoint: string) => {
  try {
    const res = await axios.get(endpoint)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendPostRequest = async (endpoint: string, params?: object) => {
  try {
    const res = await axios.post(endpoint, params)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendPutRequest = async (
  endpoint: string,
  params?: object,
) => {
  try {
    const res = await axios.put(endpoint, params)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendDeleteRequest = async (endpoint: string) => {
  try {
    await axios.delete(endpoint)
  } catch (e: any) {
    handleRequestError(e)
  }
}

interface Error {
  response?: {
    data: {
      message: string;
    };
    status: number;
  };
}

const handleRequestError = (error: Error) => {
  const code = error?.response?.status || 500
  const message = error?.response?.data.message || ''
  switch (code) {
    case 500:
      throw new Error(localeTool.t('error.500'))
    case 401:
      throw new Error(localeTool.t('error.401'))
    default:
      throw new Error(message || localeTool.t('error.500'))
  }
}
