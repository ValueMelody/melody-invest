import knex, { Knex } from 'knex'
import * as connectionEnums from '../enums/connect'

interface OrderBy {
  key: string;
  type: 'asc' | 'desc';
}

export interface Condition {
  key: string;
  value: string | number | boolean | null;
  type?: string;
}

interface Find {
  tableName: string;
  conditions?: Condition[];
  orderBy?: OrderBy;
  limit?: number;
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
  orderBy = { key: 'id', type: 'asc' },
  limit,
}: Find): Promise<any[] | null> => {
  const db = getConnection()
  const query = db.select('*').from(tableName)

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

  if (orderBy) {
    const { key, type } = orderBy
    query.orderBy(key, type)
  }

  if (limit) query.limit(limit)

  const records = await query
  return records
}

export const findOne = async (
  params: Find,
): Promise<any | null> => {
  const records = await find(params)
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
