import Redis from 'ioredis'
import RedisMock from 'ioredis-mock'
import ms from 'ms'
import * as adapterEnum from '../enums/adapter'

let _cache: Redis.Redis | null = null

export const initTestConnection = () => {
  _cache = new RedisMock()
}

export const initConnection = () => {
  _cache = new Redis(adapterEnum.CacheConfig.Connection)
}

const getConnection = (): Redis.Redis => {
  if (!_cache) initConnection()
  return _cache!
}

export const get = async (key: string): Promise<string | null> => {
  const cache = getConnection()
  const stored = await cache.get(key)
  return stored || null
}

export const set = async (
  key: string,
  value: string,
  age: '1d',
) => {
  const cache = getConnection()
  const cacheAge = ms(age) / 1000
  return cache.set(key, value, 'EX', cacheAge)
}

export const empty = async () => {
  const cache = getConnection()
  return cache.flushall()
}
