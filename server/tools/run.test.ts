import * as run from './run'

test('could sleep by seconds', async () => {
  const start = new Date()
  await run.sleep(0.5)
  const end = new Date()
  expect(end.getTime() - start.getTime()).toBeGreaterThanOrEqual(500)

  const start1 = new Date()
  await run.sleep(0.2)
  const end1 = new Date()
  expect(end1.getTime() - start1.getTime()).toBeGreaterThanOrEqual(200)
})

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
