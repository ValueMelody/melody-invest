import axios from 'axios'
import * as localeTool from '../tools/locale'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3100'

export const sendGetRequest = async (endpoint: string) => {
  try {
    const res = await axios.get(endpoint)
    return res ? res.data : null
  } catch (e: any) {
    handleRequestError(e)
  }
}

export const sendPostRequest = async (endpoint: string, params: object) => {
  try {
    const res = await axios.post(endpoint, params)
    return res ? res.data : null
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
  const code = error?.response?.status
  const message = error?.response?.data.message
  const errorMessage = code === 500 ? localeTool.t('error.500') : message
  throw new Error(errorMessage)
}
