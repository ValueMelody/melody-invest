import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorMonthlyKeys =
  typeof tableEnum.INDICATOR_KEYS.FUNDS_RATE |
  typeof tableEnum.INDICATOR_KEYS.TEN_YEARS_TREASURY |
  typeof tableEnum.INDICATOR_KEYS.THIRTY_YEARS_TREASURY |
  typeof tableEnum.INDICATOR_KEYS.CPI |
  typeof tableEnum.INDICATOR_KEYS.INFLATION_EXPECTATION |
  typeof tableEnum.INDICATOR_KEYS.CONSUMER_SENTIMENT |
  typeof tableEnum.INDICATOR_KEYS.RETAIL_SALES |
  typeof tableEnum.INDICATOR_KEYS.DURABLE_GOODS |
  typeof tableEnum.INDICATOR_KEYS.UNEMPLOYMENT_RATE |
  typeof tableEnum.INDICATOR_KEYS.NONFARM_PAYROLL

export interface IndicatorMonthly {
  id: number;
  region: string;
  month: string;
  [tableEnum.INDICATOR_KEYS.FUNDS_RATE]: string;
  [tableEnum.INDICATOR_KEYS.CPI]: string;
  [tableEnum.INDICATOR_KEYS.TEN_YEARS_TREASURY]: string;
  [tableEnum.INDICATOR_KEYS.THIRTY_YEARS_TREASURY]: string;
  [tableEnum.INDICATOR_KEYS.INFLATION_EXPECTATION]: string;
  [tableEnum.INDICATOR_KEYS.CONSUMER_SENTIMENT]: string;
  [tableEnum.INDICATOR_KEYS.RETAIL_SALES]: string;
  [tableEnum.INDICATOR_KEYS.DURABLE_GOODS]: string;
  [tableEnum.INDICATOR_KEYS.UNEMPLOYMENT_RATE]: string;
  [tableEnum.INDICATOR_KEYS.NONFARM_PAYROLL]: string;
}

interface IndicatorMonthlyEdit {
  region?: string;
  month?: string;
  [tableEnum.INDICATOR_KEYS.FUNDS_RATE]?: string;
  [tableEnum.INDICATOR_KEYS.CPI]?: string;
  [tableEnum.INDICATOR_KEYS.TEN_YEARS_TREASURY]?: string;
  [tableEnum.INDICATOR_KEYS.THIRTY_YEARS_TREASURY]?: string;
  [tableEnum.INDICATOR_KEYS.INFLATION_EXPECTATION]?: string;
  [tableEnum.INDICATOR_KEYS.CONSUMER_SENTIMENT]?: string;
  [tableEnum.INDICATOR_KEYS.RETAIL_SALES]?: string;
  [tableEnum.INDICATOR_KEYS.DURABLE_GOODS]?: string;
  [tableEnum.INDICATOR_KEYS.UNEMPLOYMENT_RATE]?: string;
  [tableEnum.INDICATOR_KEYS.NONFARM_PAYROLL]?: string;
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
