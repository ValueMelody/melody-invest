
import * as adapterEnum from 'enums/adapter'
import * as errorEnum from 'enums/error'
import knex, { Knex } from 'knex'

interface OrderBy {
  column: string;
  order: 'asc' | 'desc';
}

export interface Condition {
  key: string;
  value: string | number | boolean | null | number[] | string[];
  type?: string;
}

export interface Join {
  joinTable: string;
  foreignKey: string;
  joinKey: string;
}

interface Find {
  tableName: string;
  conditions?: Condition[];
  orderBy?: OrderBy[];
  limit?: number;
  offset?: number;
  select?: string[];
  join?: Join;
  distinctOn?: string;
}

interface Create {
  tableName: string;
  values: object;
  transaction: Knex.Transaction;
}

interface Update {
  tableName: string;
  values: object;
  conditions: Condition[];
  transaction: Knex.Transaction;
  orderBy?: OrderBy[];
  skipReturn?: boolean;
}

interface Destroy {
  tableName: string;
  conditions?: Condition[];
  transaction: Knex.Transaction;
}

export let _db: Knex | null = null

export const setConnection = (db: Knex) => {
  _db = db
}

export const initConnection = () => {
  _db = knex({
    client: adapterEnum.DatabaseConfig.Client,
    connection: adapterEnum.DatabaseConfig.Connection,
  })
}

export const getConnection = (): Knex => {
  if (!_db) initConnection()
  return _db!
}

const find = async ({
  tableName,
  conditions,
  orderBy = [{ column: 'id', order: 'asc' }],
  limit,
  offset,
  select = ['*'],
  join,
  distinctOn,
}: Find): Promise<any[]> => {
  const db = getConnection()
  const query = db.select(...select).from(tableName)

  if (distinctOn) query.distinctOn(distinctOn)

  if (join) query.join(join.joinTable, join.foreignKey, join.joinKey)

  if (conditions) {
    conditions.forEach((condition, index) => {
      const { key, type = '=', value } = condition
      if (type === 'IN' && Array.isArray(value)) {
        query.whereIn(key, value)
      } else if (index === 0) {
        query.where(key, type, value)
      } else {
        query.andWhere(key, type, value)
      }
    })
  }

  if (orderBy) query.orderBy(orderBy)

  if (limit) query.limit(limit)

  if (offset) query.offset(offset)

  // console.info(query.toSQL().toNative())

  const records = await query
  return records
}

export const findOne = async (
  params: Find,
): Promise<any | null> => {
  const records = await find({
    ...params,
    limit: 1,
  })
  return records[0] || null
}

export const findAll = async (
  params: Find,
): Promise<any[]> => {
  const records = await find(params)
  return records
}

export const create = async ({
  tableName,
  values,
  transaction,
}: Create) => {
  const db = getConnection()
  try {
    const record = await db
      .table(tableName)
      .transacting(transaction)
      .clone()
      .insert(values)
      .returning('*')
    return record[0]
  } catch (e) {
    await transaction.rollback()
    console.log(222)
    console.error(e)
    throw errorEnum.Custom.CreationFailed
  }
}

export const update = async ({
  tableName,
  values,
  conditions,
  transaction,
  orderBy,
  skipReturn = false,
}: Update): Promise<any[]> => {
  const db = getConnection()
  const query = db
    .table(tableName)
    .transacting(transaction)
    .clone()
    .update(values)

  if (!skipReturn) query.returning('*')

  if (orderBy) query.orderBy(orderBy)

  conditions.forEach((condition, index) => {
    const { key, type = '=', value } = condition
    if (index === 0) {
      query.where(key, type, value)
    } else {
      query.andWhere(key, type, value)
    }
  })

  try {
    const records = await query
    return Array.isArray(records) ? records : []
  } catch (e) {
    await transaction.rollback()
    throw errorEnum.Custom.UpdationFailed
  }
}

export const destroy = async ({
  tableName,
  conditions,
  transaction,
}: Destroy) => {
  const db = getConnection()
  const query = db
    .table(tableName)
    .transacting(transaction)
    .clone()
    .delete()

  conditions?.forEach((condition, index) => {
    const { key, type = '=', value } = condition
    if (index === 0) {
      query.where(key, type, value)
    } else {
      query.andWhere(key, type, value)
    }
  })

  await query

  return true
}

export const createTransaction = async (): Promise<Knex.Transaction> => {
  const db = getConnection()
  return new Promise((resolve) => {
    return db.transaction(resolve)
  })
}

export const runWithTransaction = async (
  func: (transaction: Knex.Transaction) => any,
): Promise<any> => {
  const transaction = await createTransaction()
  try {
    const result = await func(transaction)
    await transaction.commit()
    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
