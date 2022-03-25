import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getSystemDefined = async (): Promise<interfaces.traderEnvModel.Record[]> => {
  const envs = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_ENV,
    conditions: [
      { key: 'isSystem', value: true },
    ],
  })
  return envs
}
