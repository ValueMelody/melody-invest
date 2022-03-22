import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const convertToRecord = (
  raw: interfaces.indicatorYearlyModel.Raw,
): interfaces.indicatorYearlyModel.Record => ({
  ...raw,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
  inflation: raw.inflation ? parseFloat(raw.inflation) : null,
  gdpYearlyChangePercent: raw.gdpYearlyChangePercent ? parseFloat(raw.gdpYearlyChangePercent) : null,
})

export const getByUK = async (
  year: string,
): Promise<interfaces.indicatorYearlyModel.Record | null> => {
  const yearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.INDICATOR_YEARLY,
    conditions: [
      { key: 'year', value: year },
    ],
  })
  return yearly ? convertToRecord(yearly) : null
}

export const getAll = async (): Promise<
  interfaces.indicatorYearlyModel.Record[]
> => {
  const yearly = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.INDICATOR_YEARLY,
    orderBy: [{ column: 'year', order: 'asc' }],
  })
  return yearly.map((raw) => convertToRecord(raw))
}

export const getPublishedByDate = async (date: string) => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const [year, quarter] = currentQuarter.split('-')

  const previousYear = dateTool.getPreviousYear(year)
  const yearBeforePrevious = dateTool.getPreviousYear(previousYear)
  const targetYear = quarter === '03' ? yearBeforePrevious : previousYear

  const raw = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.INDICATOR_YEARLY,
    conditions: [
      { key: 'year', value: targetYear },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const create = async (
  values: interfaces.indicatorYearlyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.indicatorYearlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: tableEnum.NAME.INDICATOR_YEARLY,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  indicatorYearlyId: number,
  values: interfaces.indicatorYearlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.indicatorYearlyModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAME.INDICATOR_YEARLY,
    values,
    conditions: [
      { key: 'id', value: indicatorYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
