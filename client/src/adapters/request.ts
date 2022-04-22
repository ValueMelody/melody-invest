import * as vendorTool from '../tools/vendor'
import * as localeTool from '../tools/locale'

vendorTool.request.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3100'

export const setJWTToken = (token: string) => {
  vendorTool.request.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const sendGetRequest = async (endpoint: string) => {
  try {
    const res = await vendorTool.request.get(endpoint)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendPostRequest = async (endpoint: string, params?: object) => {
  try {
    const res = await vendorTool.request.post(endpoint, params)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendPutRequest = async (endpoint: string, params?: object) => {
  try {
    const res = await vendorTool.request.put(endpoint, params)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendDeleteRequest = async (endpoint: string) => {
  try {
    await vendorTool.request.delete(endpoint)
  } catch (e: any) {
    handleRequestError(e)
  }
}

interface Error {
  response?: {
    data: {
      message: string
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
      throw new Error(message)
  }
}
