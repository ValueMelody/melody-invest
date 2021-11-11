import knex, { Knex } from 'knex'

interface OrderBy {
  key: string;
  type: 'asc' | 'desc';
}

interface Condition {
  key: string;
  value: string | number;
  type?: string;
}

interface Find {
  tableName: string;
  conditions?: Condition[];
  orderBy?: OrderBy;
}

interface Edit {
  tableName: string;
  values: object;
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

export const findOne = async ({
  tableName,
  conditions,
  orderBy
}: Find): Promise<any | null> => {
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
  return records?.length ? records[0] : null
}

export const createOne = async ({
  tableName,
  values
}: Edit) => {
  const db = getConnection()
  const record = await db
    .table(tableName)
    .insert(values)
    .returning('*')
  return record
}
