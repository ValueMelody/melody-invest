import * as cache from './cache'

beforeAll(async () => {
  cache.initConnection()
})

afterAll(async () => {
  await cache.empty()
})

describe('#initConnection', () => {
  test('have defined', () => {
    expect(cache.initConnection).toBeDefined()
  })
})

describe('#set', () => {
  test('could set cache', async () => {
    expect(await cache.set('key1', 'value1', '1d')).toBeTruthy()
    expect(await cache.set('key2', 'value2', '1d')).toBeTruthy()
    expect(await cache.set('key3', 'value3', '1d')).toBeTruthy()
  })
})

describe('#get', () => {
  test('could get cache', async () => {
    expect(await cache.get('key1')).toBe('value1')
    expect(await cache.get('key2')).toBe('value2')
    expect(await cache.get('key3')).toBe('value3')
    expect(await cache.get('key4')).toBeNull()
  })
})

describe('#empty', () => {
  test('could empty', async () => {
    expect(await cache.empty()).toBeTruthy()
    expect(await cache.get('key1')).toBeNull()
    expect(await cache.get('key2')).toBeNull()
    expect(await cache.get('key3')).toBeNull()
  })
})

describe('#returnBuild', () => {
  test('could build and return', async () => {
    const generateFunc = jest.fn(async () => ({ stored: true }))
    const cacheKey = 'testReturnBuild'
    const firstCall = await cache.returnBuild({
      cacheAge: '1d',
      cacheKey,
      buildFunction: generateFunc,
    })
    expect(firstCall).toStrictEqual({ stored: true })
    const secondCall = await cache.returnBuild({
      cacheAge: '1d',
      cacheKey,
      buildFunction: generateFunc,
    })
    expect(secondCall).toStrictEqual({ stored: true })
    const thirdCall = await cache.returnBuild({
      cacheAge: '1d',
      cacheKey,
      buildFunction: generateFunc,
    })
    expect(thirdCall).toStrictEqual({ stored: true })

    expect(generateFunc).toBeCalledTimes(1)
  })
})
