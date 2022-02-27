import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorKeys = 'realGDP'

export interface Record {
  id: number;
  region: string;
  quarter: string;
  realGDP: number | null;
  gdpQuarterlyChangePercent: string | null;
  gdpQuarterlyYoYChangePercent: string | null;
}

interface Raw {
  id: number;
  region: string;
  quarter: string;
  realGDP: string | null;
  gdpQuarterlyChangePercent: string | null;
  gdpQuarterlyYoYChangePercent: string | null;
}

interface Create {
  region: string;
  quarter: string;
  realGDP?: string;
}

interface Update {
  realGDP?: string;
  gdpQuarterlyChangePercent?: string;
  gdpQuarterlyYoYChangePercent?: string;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  region: raw.region,
  quarter: raw.quarter,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
  gdpQuarterlyChangePercent: raw.gdpQuarterlyChangePercent,
  gdpQuarterlyYoYChangePercent: raw.gdpQuarterlyYoYChangePercent,
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

export const getAll = async (): Promise<Record[]> => {
  const yearly = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    orderBy: { key: 'quarter', type: 'asc' },
  })
  return yearly
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values,
    transaction,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  indicatorQuarterlyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: indicatorQuarterlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
