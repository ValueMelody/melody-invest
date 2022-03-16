import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  userId: number;
  traderId: number;
}

export const getUserFollowed = async (
  userId: number,
): Promise<Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{ column: 'traderId', order: 'asc' }],
  })
  return records
}
