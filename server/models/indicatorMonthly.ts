import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface IndicatorMonthly {
  id: number;
  region: string;
  month: string;
  fundsRate: string;
  cpi: string;
  '10YearsTreasury': string;
  '30YearsTreasury': string;
  inflationExpectation: string;
  consumerSentiment: string;
  retailSales: string;
  durableGoods: string;
}

interface IndicatorMonthlyEdit {
  region?: string;
  month?: string;
  fundsRate?: string;
  cpi?: string;
  '10YearsTreasury'?: string;
  '30YearsTreasury'?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
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
