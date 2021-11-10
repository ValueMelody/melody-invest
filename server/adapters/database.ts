import knex, { Knex } from 'knex'

interface Find {
  tableName: string;
  filters?: object;
}

interface Edit {
  tableName: string;
  values: object;
  filters?: object;
  id?: number;
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
  filters
}: Find): Promise<any | null> => {
  const db = getConnection()
  const query = db
    .select('*')
    .from(tableName)
  if (filters) query.where(filters)

  const records = await query
  return records?.length === 1 ? records[0] : null
}

export const findAll = async ({
  tableName
}: Find) => {
  const db = getConnection()
  const records = await db.select('*').from(tableName)
  return records
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

export const updateById = async ({
  tableName,
  id,
  values
}: Edit) => {
  const db = getConnection()
  const records = await db
    .table(tableName)
    .update(values)
    .where({ id })
    .returning('*')
  return records[0]
}

export const upsertOne = async ({
  tableName,
  filters,
  values
}: Edit) => {
  const record = await findOne({ tableName, filters })
  const newRecord = record
    ? await updateById({
      tableName,
      values,
      id: record.id
    })
    : await createOne({
      tableName,
      values: { ...filters, ...values }
    })
  return newRecord
}
