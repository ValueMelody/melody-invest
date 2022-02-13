import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type IndicatorKeys =
  'fundsRate' | 'tenYearsTreasury' | 'thirtyYearsTreasury' | 'cpi' |
  'inflationExpectation' | 'consumerSentiment' | 'retailSales' |
  'durableGoods' | 'unemploymentRate' | 'nonfarmPayroll'

export interface Record {
  id: number;
  region: string;
  month: string;
  fundsRate: number | null;
  cpi: number | null;
  tenYearsTreasury: number | null;
  thirtyYearsTreasury: number | null;
  inflationExpectation: number | null;
  consumerSentiment: number | null;
  retailSales: number | null;
  durableGoods: number | null;
  unemploymentRate: number | null;
  nonfarmPayroll: number | null;
}

export interface Raw {
  id: number;
  region: string;
  month: string;
  fundsRate: string | null;
  cpi: string | null;
  tenYearsTreasury: string | null;
  thirtyYearsTreasury: string | null;
  inflationExpectation: string | null;
  consumerSentiment: string | null;
  retailSales: string | null;
  durableGoods: string | null;
  unemploymentRate: string | null;
  nonfarmPayroll: string | null;
}

interface Create {
  region: string;
  month: string;
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

interface Update {
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

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  region: raw.region,
  month: raw.month,
  fundsRate: raw.fundsRate ? parseFloat(raw.fundsRate) : null,
  cpi: raw.cpi ? parseFloat(raw.cpi) : null,
  tenYearsTreasury: raw.tenYearsTreasury ? parseFloat(raw.tenYearsTreasury) : null,
  thirtyYearsTreasury: raw.thirtyYearsTreasury ? parseFloat(raw.thirtyYearsTreasury) : null,
  inflationExpectation: raw.inflationExpectation ? parseFloat(raw.inflationExpectation) : null,
  consumerSentiment: raw.consumerSentiment ? parseFloat(raw.consumerSentiment) : null,
  retailSales: raw.retailSales ? parseInt(raw.retailSales) : null,
  durableGoods: raw.durableGoods ? parseInt(raw.durableGoods) : null,
  unemploymentRate: raw.unemploymentRate ? parseFloat(raw.unemploymentRate) : null,
  nonfarmPayroll: raw.nonfarmPayroll ? parseInt(raw.nonfarmPayroll) : null,
})

export const getByUK = async (
  region: string,
  month: string,
): Promise<Record | null> => {
  const monthly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    conditions: [
      { key: 'region', value: region },
      { key: 'month', value: month },
    ],
  })
  return monthly ? convertToRecord(monthly) : null
}

export const create = async (
  values: Create,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    values,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  indicatorMonthlyId: number,
  values: Update,
): Promise<Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAMES.INDICATOR_MONTHLY,
    values,
    conditions: [
      { key: 'id', value: indicatorMonthlyId },
    ],
  })
  return convertToRecord(updated[0])
}
