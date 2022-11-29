import * as adapterEnum from 'enums/adapter'
import Redis from 'ioredis'
import ms from 'ms'

let _cache: Redis.Redis | null = null

type Age = '1d' | string

export const initConnection = () => {
  _cache = new Redis(adapterEnum.CacheConfig.Connection)
}

const getConnection = (): Redis.Redis => {
  // istanbul ignore next
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
  age: Age,
) => {
  const cache = getConnection()
  const cacheAge = ms(age) / 1000
  return cache.set(key, value, 'EX', cacheAge)
}

export const empty = async () => {
  const cache = getConnection()
  return cache.flushall()
}

export const returnBuild = async (
  cacheKey: string,
  cacheAge: Age,
  buildFunction: Function,
) => {
  const stored = await get(cacheKey)
  if (stored) return JSON.parse(stored)
  const data = await buildFunction()
  set(cacheKey, JSON.stringify(data), cacheAge)
  return data
}
