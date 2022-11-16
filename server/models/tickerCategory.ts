
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'

const TableName = adapterEnum.DatabaseTable.TickerCategory

const convertToRecord = (
  raw: interfaces.tickerCategoryModel.Raw,
): interfaces.tickerCategoryModel.Record => {
  return {
    id: raw.id,
    name: raw.name,
  }
}

export const getAll = async (): Promise<interfaces.tickerCategoryModel.Record[]> => {
  const categories = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return categories.map(convertToRecord)
}
