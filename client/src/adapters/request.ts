import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3100'

export const sendGetRequest = async (endpoint: string) => {
  const res = await axios.get(endpoint).catch(handleRequestError)
  return res ? res.data : null
}

const handleRequestError = () => {
}
