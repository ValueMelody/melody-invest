import Redis from 'ioredis'

let _cache: Redis.Redis | null = null

export const initConnection = () => {
  _cache = new Redis({
    host: process.env.CACHE_HOST,
    port: parseInt(process.env.CACHE_PORT!),
  })
}

const getConnection = (): Redis.Redis => {
  if (!_cache) initConnection()
  return _cache!
}

export const get = async (key: string) => {
  const cache = getConnection()
  return cache.get(key)
}

export const set = async (
  key: string, value: string,
) => {
  const cache = getConnection()
  return cache.set(key, value)
}
