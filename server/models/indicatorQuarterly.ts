import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorKeys = 'realGDP'

export interface Record {
  id: number;
  region: string;
  quarter: string;
  realGDP: number | null;
}

interface Raw {
  id: number;
  region: string;
  quarter: string;
  realGDP: string | null;
}

interface Create {
  region: string;
  quarter: string;
  realGDP?: string;
}

interface Update {
  realGDP?: string;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  region: raw.region,
  quarter: raw.quarter,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
})

export const getByUK = async (
  region: string,
  quarter: string,
): Promise<Record | null> => {
  const quarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'quarter', value: quarter },
    ],
  })
  return quarterly ? convertToRecord(quarterly) : null
}

export const create = async (
  values: Create,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  indicatorQuarterlyId: number,
  values: Update,
): Promise<Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: indicatorQuarterlyId },
    ],
  })
  return convertToRecord(updated[0])
}
