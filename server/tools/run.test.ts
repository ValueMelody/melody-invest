import * as run from './run'

describe('#sleep', () => {
  test('could sleep by seconds', async () => {
    const start = new Date()
    await run.sleep(0.5)
    const end = new Date()
    expect(500 - end.getTime() + start.getTime()).toBeLessThanOrEqual(1)

    const start1 = new Date()
    await run.sleep(0.2)
    const end1 = new Date()
    expect(200 - end1.getTime() + start1.getTime()).toBeLessThanOrEqual(1)
  })
})

describe('#asyncForEach', () => {
  test('could loop by async forEach', async () => {
    const input = ['a', 'b', 'c']
    const output: {item: string; index: number}[] = []
    await run.asyncForEach(input, (item: string, index: number) => {
      output.push({ item, index })
    })
    expect(output).toStrictEqual([
      { item: 'a', index: 0 },
      { item: 'b', index: 1 },
      { item: 'c', index: 2 },
    ])
  })
})

describe('#asyncMap', () => {
  test('could loop by async Map', async () => {
    const input = ['a', 'b', 'c']
    const output = await run.asyncMap(input, (item: string, index: number) => {
      return { item, index }
    })
    expect(output).toStrictEqual([
      { item: 'a', index: 0 },
      { item: 'b', index: 1 },
      { item: 'c', index: 2 },
    ])
  })
})
