import knex from 'knex'

interface Database {
  select: Function;
}

interface Find {
  tableName: string;
  filters?: object;
  fields?: string[];
}

let _db: Database | null = null

export const initConnection = () => {
  _db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  })
}

const getConnection = (): Database => {
  if (!_db) initConnection()
  return _db!
}

export const findOne = async ({
  tableName,
  filters,
  fields = ['*']
}: Find): Promise<object | null> => {
  const db = getConnection()
  const query = db
    .select(...fields)
    .from(tableName)
  if (filters) query.where(filters)

  const records = await query
  return records?.length === 1 ? records[0] : null
}

export const findAll = async ({
  tableName,
  fields = ['*']
}: Find) => {
  const db = getConnection()
  const records = await db.select(...fields).from(tableName)
  return records
}
