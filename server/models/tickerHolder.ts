import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const create = async (
  values: interfaces.tickerHolderModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerHolderModel.Record> => {
  const result = await databaseAdapter.create({
    tableName: tableEnum.NAME.TICKER_HOLDER,
    values,
    transaction,
  })
  return result
}

export const destroyTraderTickers = async (
  traderId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: tableEnum.NAME.TICKER_HOLDER,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
