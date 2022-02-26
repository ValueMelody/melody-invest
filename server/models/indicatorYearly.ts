import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorKeys = 'inflation' | 'realGDP'

export interface Record {
  id: number;
  year: string;
  region: string;
  realGDP: number | null;
  inflation: number | null;
}

interface Raw {
  id: number;
  year: string;
  region: string;
  realGDP: string | null;
  inflation: string | null;
}

interface Create {
  year: string;
  region: string;
  realGDP?: string;
  inflation?: string;
}

interface Update {
  realGDP?: string;
  inflation?: string;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  year: raw.year,
  region: raw.region,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
  inflation: raw.inflation ? parseFloat(raw.inflation) : null,
})

export const getByUK = async (
  region: string,
  year: string,
): Promise<Record | null> => {
  const yearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'year', value: year },
    ],
  })
  return yearly ? convertToRecord(yearly) : null
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    values,
    transaction,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  indicatorYearlyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_YEARLY,
    values,
    conditions: [
      { key: 'id', value: indicatorYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
