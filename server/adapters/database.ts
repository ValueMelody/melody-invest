import knex, { Knex } from 'knex'
import * as connectionEnums from '../enums/connect'

interface OrderBy {
  column: string;
  order: 'asc' | 'desc';
}

export interface Condition {
  key: string;
  value: string | number | boolean | null;
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

let _db: Knex | null = null

export const initConnection = () => {
  _db = knex({
    client: connectionEnums.databaseClient,
    connection: connectionEnums.databaseConfig,
  })
}

const getConnection = (): Knex => {
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

  if (conditions) {
    conditions.forEach((condition, index) => {
      const { key, type = '=', value } = condition
      if (index === 0) {
        query.where(key, type, value)
      } else {
        query.andWhere(key, type, value)
      }
    })
  }

  if (groupBy) query.groupBy(...groupBy)

  if (orderBy) query.orderBy(orderBy)

  if (limit) query.limit(limit)

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
  return record
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
  return records
}

export const createTransaction = async (): Promise<Knex.Transaction> => {
  const db = getConnection()
  return new Promise((resolve) => {
    return db.transaction(resolve)
  })
}
