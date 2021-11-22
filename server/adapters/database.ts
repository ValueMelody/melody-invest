import knex, { Knex } from 'knex'

interface OrderBy {
  key: string;
  type: 'asc' | 'desc';
}

export interface Condition {
  key: string;
  value: string | number | null;
  type?: string;
}

interface Find {
  tableName: string;
  conditions?: Condition[];
  orderBy?: OrderBy;
}

interface Create {
  tableName: string;
  values: object;
}

interface Update {
  tableName: string;
  values: object;
  conditions: Condition[];
}

let _db: Knex | null = null

export const initConnection = () => {
  _db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  })
}

const getConnection = (): Knex => {
  if (!_db) initConnection()
  return _db!
}

const find = async ({
  tableName,
  conditions,
  orderBy = { key: 'id', type: 'asc' }
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

  const records = await query
  return records
}

export const findOne = async (
  params: Find
): Promise<any | null> => {
  const records = await find(params)
  return records?.length ? records[0] : null
}

export const findAll = async (
  params: Find
): Promise<any[]> => {
  const records = await find(params)
  return records?.length ? records : []
}

export const create = async ({
  tableName,
  values
}: Create) => {
  const db = getConnection()
  const record = await db
    .table(tableName)
    .insert(values)
    .returning('*')
  return record
}

export const update = async ({
  tableName,
  values,
  conditions
}: Update) => {
  const db = getConnection()
  const query = db
    .table(tableName)
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