import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export type IndicatorKey = 'realGDP'

export type CompareKey = 'gdpQuarterlyChangePercent' | 'gdpQuarterlyYoYChangePercent'

interface Common {
  id: number;
  quarter: string;
  reportMonth: string;
}

export interface Record extends Common {
  realGDP: number | null;
  gdpQuarterlyChangePercent: number | null;
  gdpQuarterlyYoYChangePercent: number | null;
}

interface Raw extends Common {
  realGDP: string | null;
  gdpQuarterlyChangePercent: string | null;
  gdpQuarterlyYoYChangePercent: string | null;
}

interface Create {
  quarter: string;
  reportMonth: string;
  realGDP?: string;
}

interface Update {
  realGDP?: string;
  gdpQuarterlyChangePercent?: string | null;
  gdpQuarterlyYoYChangePercent?: string | null;
}

const convertToRecord = (raw: Raw): Record => ({
  ...raw,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
  gdpQuarterlyChangePercent: raw.gdpQuarterlyChangePercent ? parseFloat(raw.gdpQuarterlyChangePercent) : null,
  gdpQuarterlyYoYChangePercent: raw.gdpQuarterlyYoYChangePercent ? parseFloat(raw.gdpQuarterlyYoYChangePercent) : null,
})

export const getByUK = async (
  quarter: string,
): Promise<Record | null> => {
  const quarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    conditions: [
      { key: 'quarter', value: quarter },
    ],
  })
  return quarterly ? convertToRecord(quarterly) : null
}

export const getPublishedByDate = async (date: string): Promise<Record | null> => {
  const targetDate = dateTool.getPreviousDate(date, 30)
  const quarter = dateTool.getQuarterByDate(targetDate)
  const previousQuarter = dateTool.getPreviousQuarter(quarter)

  const raw = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    conditions: [
      { key: 'quarter', value: previousQuarter },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const getAll = async (): Promise<Record[]> => {
  const quarterly = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.INDICATOR_QUARTERLY,
    orderBy: [{ column: 'quarter', order: 'asc' }],
  })
  return quarterly.map((raw) => convertToRecord(raw))
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
