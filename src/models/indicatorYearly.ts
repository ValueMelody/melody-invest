import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface IndicatorYearly {
  id: number;
  region: string;
  realGdp: string;
  year: string;
}

interface IndicatorYearlyEdit {
  region?: string;
  realGdp?: string;
  year?: string;
}

export const getByUK = async (
  region: string,
  year: string
): Promise<IndicatorYearly | null> => {
  const yearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'year', value: year }
    ]
  })
  return yearly
}

export const create = async (
  values: IndicatorYearlyEdit
): Promise<IndicatorYearly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  indicatorYearlyId: number,
  values: IndicatorYearlyEdit
): Promise<IndicatorYearly> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    values,
    conditions: [
      { key: 'id', value: indicatorYearlyId }
    ]
  })
  return updated?.length ? updated[0] : null
}
