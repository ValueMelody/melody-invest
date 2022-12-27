import * as adapterEnum from 'enums/adapter'
import Redis from 'ioredis'
import ms from 'ms'

let _cache: Redis.Redis | null = null
let _localCache: Redis.Redis | null = null

type Age = '1d' | string

export const initConnection = () => {
  _cache = new Redis(adapterEnum.CacheConfig.Connection)
  if (adapterEnum.CacheConfig.Connection.host !== adapterEnum.CacheConfig.LocalConnection.host) {
    _localCache = new Redis(adapterEnum.CacheConfig.LocalConnection)
  }
}

const getConnection = (): Redis.Redis => {
  // istanbul ignore next
  if (!_cache) initConnection()
  return _cache!
}

const getPreferredConection = (preferLocal: boolean) => {
  return preferLocal && _localCache ? _localCache : getConnection()
}

export const get = async (key: string, preferLocal: boolean = false): Promise<string | null> => {
  const cache = getPreferredConection(preferLocal)
  const stored = await cache.get(key)
  return stored || null
}

export const set = async (
  key: string,
  value: string,
  age: Age,
  preferLocal: boolean = false,
) => {
  const cache = getPreferredConection(preferLocal)
  const cacheAge = ms(age) / 1000
  return cache.set(key, value, 'EX', cacheAge)
}

export const empty = async () => {
  if (_localCache) _localCache.flushall()
  const cache = getConnection()
  return cache.flushall()
}

export const returnBuild = async (
  cacheKey: string,
  cacheAge: Age,
  buildFunction: Function,
  preferLocal: boolean = false,
) => {
  const stored = await get(cacheKey, preferLocal)
  if (stored) return JSON.parse(stored)
  const data = await buildFunction()
  set(cacheKey, JSON.stringify(data), cacheAge, preferLocal)
  return data
}
