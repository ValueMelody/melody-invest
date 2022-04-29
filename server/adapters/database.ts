import knex, { Knex } from 'knex'
import pgmem, { DataType } from 'pg-mem'
import * as errorEnum from '../enums/error'
import * as adapterEnum from '../enums/adapter'
import { randomUUID } from 'crypto'

interface OrderBy {
  column: string;
  order: 'asc' | 'desc';
}

export interface Condition {
  key: string;
  value: string | number | boolean | null | number[];
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
  leftJoin?: Join;
  join?: Join;
  groupBy?: string[];
  groupByRaw?: string;
  max?: string;
  distinct?: string;
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
}

interface Destroy {
  tableName: string;
  conditions: Condition[];
  transaction: Knex.Transaction;
}

let _db: Knex | null = null

export const initTestConnection = (): pgmem.IMemoryDb => {
  const db = pgmem.newDb()
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => randomUUID(),
  })
  _db = db.adapters.createKnex()
  return db
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
  select = ['*'],
  leftJoin,
  join,
  groupBy,
  max,
  distinct,
  distinctOn,
}: Find): Promise<any[] | null> => {
  const db = getConnection()
  const query = db.select(...select).from(tableName)

  if (max) query.max(max)

  if (distinct) query.distinct(distinct)

  if (distinctOn) query.distinctOn(distinctOn)

  if (leftJoin) query.leftJoin(leftJoin.joinTable, leftJoin.foreignKey, leftJoin.joinKey)

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

  if (groupBy) query.groupBy(...groupBy)

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
  const record = await db
    .table(tableName)
    .transacting(transaction)
    .clone()
    .insert(values)
    .returning('*')
  if (!record || record?.length !== 1) throw errorEnum.Custom.CreationFailed
  return record[0]
}

export const update = async ({
  tableName,
  values,
  conditions,
  transaction,
}: Update) => {
  const db = getConnection()
  const query = db
    .table(tableName)
    .transacting(transaction)
    .clone()
    .update(values)
    .returning('*')

  conditions.forEach((condition, index) => {
    const { key, type = '=', value } = condition
    if (index === 0) {
      query.where(key, type, value)
    } else {
      query.andWhere(key, type, value)
    }
  })

  const records = await query

  if (!records || records.length === 0) throw errorEnum.Custom.UpdationFailed
  return records
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

  conditions.forEach((condition, index) => {
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
