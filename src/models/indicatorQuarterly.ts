import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface IndicatorQuarterly {
  id: number;
  region: string;
  realGdp: string;
  quarter: string;
}

interface IndicatorQuarterlyEdit {
  region?: string;
  realGdp?: string;
  quarter?: string;
}

export const getByUK = async (
  region: string,
  quarter: string
): Promise<IndicatorQuarterly | null> => {
  const quarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'quarter', value: quarter }
    ]
  })
  return quarterly
}

export const create = async (
  values: IndicatorQuarterlyEdit
): Promise<IndicatorQuarterly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  indicatorQuarterlyId: number,
  values: IndicatorQuarterlyEdit
): Promise<IndicatorQuarterly> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: indicatorQuarterlyId }
    ]
  })
  return updated?.length ? updated[0] : null
}
