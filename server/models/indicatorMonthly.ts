import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorMonthlyKeys =
  'fundsRate' | 'tenYearsTreasury' | 'thirtyYearsTreasury' | 'cpi' |
  'inflationExpectation' | 'consumerSentiment' | 'retailSales' |
  'durableGoods' | 'unemploymentRate' | 'nonfarmPayroll'

export interface IndicatorMonthly {
  id: number;
  region: string;
  month: string;
  fundsRate: string;
  cpi: string;
  tenYearsTreasury: string;
  thirtyYearsTreasury: string;
  inflationExpectation: string;
  consumerSentiment: string;
  retailSales: string;
  durableGoods: string;
  unemploymentRate: string;
  nonfarmPayroll: string;
}

interface IndicatorMonthlyEdit {
  region?: string;
  month?: string;
  fundsRate?: string;
  cpi?: string;
  tenYearsTreasury?: string;
  thirtyYearsTreasury?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
  unemploymentRate?: string;
  nonfarmPayroll?: string;
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
