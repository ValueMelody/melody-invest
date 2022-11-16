
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'

const TableName = adapterEnum.DatabaseTable.Policy

export const getLatest = async (
  type: number,
): Promise<interfaces.policyModel.Record | null> => {
  const content = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'type', value: type },
    ],
    orderBy: [{ column: 'createdAt', order: 'desc' }],
  })
  return content
}
