import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

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
    tableName: tableEnum.NAME.TICKER_CATEGORY,
  })
  return categories.map(convertToRecord)
}
