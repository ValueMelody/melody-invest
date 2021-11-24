import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorMonthlyKeys =
  typeof tableEnum.KEYS.FUNDS_RATE |
  typeof tableEnum.KEYS.TEN_YEARS_TREASURY |
  typeof tableEnum.KEYS.THIRTY_YEARS_TREASURY |
  typeof tableEnum.KEYS.CPI |
  typeof tableEnum.KEYS.INFLATION_EXPECTATION |
  typeof tableEnum.KEYS.CONSUMER_SENTIMENT |
  typeof tableEnum.KEYS.RETAIL_SALES |
  typeof tableEnum.KEYS.DURABLE_GOODS |
  typeof tableEnum.KEYS.UNEMPLOYMENT_RATE

export interface IndicatorMonthly {
  id: number;
  region: string;
  month: string;
  [tableEnum.KEYS.FUNDS_RATE]: string;
  [tableEnum.KEYS.CPI]: string;
  [tableEnum.KEYS.TEN_YEARS_TREASURY]: string;
  [tableEnum.KEYS.THIRTY_YEARS_TREASURY]: string;
  [tableEnum.KEYS.INFLATION_EXPECTATION]: string;
  [tableEnum.KEYS.CONSUMER_SENTIMENT]: string;
  [tableEnum.KEYS.RETAIL_SALES]: string;
  [tableEnum.KEYS.DURABLE_GOODS]: string;
  [tableEnum.KEYS.UNEMPLOYMENT_RATE]: string;
}

interface IndicatorMonthlyEdit {
  region?: string;
  month?: string;
  [tableEnum.KEYS.FUNDS_RATE]?: string;
  [tableEnum.KEYS.CPI]?: string;
  [tableEnum.KEYS.TEN_YEARS_TREASURY]?: string;
  [tableEnum.KEYS.THIRTY_YEARS_TREASURY]?: string;
  [tableEnum.KEYS.INFLATION_EXPECTATION]?: string;
  [tableEnum.KEYS.CONSUMER_SENTIMENT]?: string;
  [tableEnum.KEYS.RETAIL_SALES]?: string;
  [tableEnum.KEYS.DURABLE_GOODS]?: string;
  [tableEnum.KEYS.UNEMPLOYMENT_RATE]?: string;
}

export const getByUK = async (
  region: string,
  month: string
): Promise<IndicatorMonthly | null> => {
  const monthly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'month', value: month }
    ]
  })
  return monthly
}

export const create = async (
  values: IndicatorMonthlyEdit
): Promise<IndicatorMonthly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  indicatorMonthlyId: number,
  values: IndicatorMonthlyEdit
): Promise<IndicatorMonthly> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    values,
    conditions: [
      { key: 'id', value: indicatorMonthlyId }
    ]
  })
  return updated?.length ? updated[0] : null
}
