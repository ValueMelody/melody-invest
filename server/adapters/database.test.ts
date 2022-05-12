import * as database from './database'

describe('#functions', () => {
  test('Have defined all required functions', () => {
    expect(database.initConnection).toBeDefined()
    expect(database.getConnection).toBeDefined()
    expect(database.findOne).toBeDefined()
    expect(database.findAll).toBeDefined()
    expect(database.create).toBeDefined()
    expect(database.update).toBeDefined()
    expect(database.destroy).toBeDefined()
    expect(database.createTransaction).toBeDefined()
  })
})
