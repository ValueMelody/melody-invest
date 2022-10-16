import knex, { Knex } from 'knex'
import pgMem, { DataType } from 'pg-mem'
import { randomUUID } from 'crypto'
import * as errorEnum from 'enums/error'
import * as adapterEnum from 'enums/adapter'

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
}

interface Destroy {
  tableName: string;
  conditions?: Condition[];
  transaction: Knex.Transaction;
}

let _db: Knex | null = null

// istanbul ignore next
export const _initTestConnection = () => {
  const db = pgMem.newDb()
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => randomUUID(),
  })
  _db = db.adapters.createKnex(0)
}

// istanbul ignore next
export const initConnection = () => {
  _db = knex({
    client: adapterEnum.DatabaseConfig.Client,
    connection: adapterEnum.DatabaseConfig.Connection,
  })
}

export const getConnection = (): Knex => {
  // istanbul ignore next
  if (!_db) initConnection()
  return _db!
}

const find = async ({
  tableName,
  conditions,
  orderBy = [{ column: 'id', order: 'asc' }],
  limit,
  select = ['*'],
  join,
  distinctOn,
}: Find): Promise<any[] | null> => {
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
  return records?.length ? records[0] : null
}

export const findAll = async (
  params: Find,
): Promise<any[]> => {
  const records = await find(params)
  return records?.length ? records : []
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
    throw errorEnum.Custom.CreationFailed
  }
}

export const update = async ({
  tableName,
  values,
  conditions,
  transaction,
  orderBy,
}: Update) => {
  const db = getConnection()
  const query = db
    .table(tableName)
    .transacting(transaction)
    .clone()
    .update(values)
    .returning('*')

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

    if (!records) {
      await transaction.rollback()
      throw errorEnum.Custom.UpdationFailed
    }
    return records
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

export type Transaction = Knex.Transaction

export const createTransaction = async (): Promise<Knex.Transaction> => {
  const db = getConnection()
  return new Promise((resolve) => {
    return db.transaction(resolve)
  })
}
