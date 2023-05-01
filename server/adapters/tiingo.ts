import * as generateTool from 'tools/generate'
import axios from 'axios'
import qs from 'qs'

const TiingoBaseUrl = 'https://api.tiingo.com/tiingo/'

export interface TiingoPrice {
  date: string;
  close: number;
  volume: number;
  splitFactor: number;
}

export const getTickerPrices = async (
  symbol: string,
  startDate: string,
  endDate: string,
  dataKey: string,
): Promise<TiingoPrice[]> => {
  const queryParams = qs.stringify({
    token: generateTool.decodeDataKey(dataKey),
    startDate,
    endDate,
  })
  const url = `${TiingoBaseUrl}/daily/${symbol}/prices?${queryParams}`
  const result = await axios.get(url)

  if (!result?.data) throw new Error('Price data not exists')

  return result.data
}

type BalanceSheetDataCode = 'equity' | 'sharesBasic' | 'totalAssets' | 'totalLiabilities'
type CashFlowDataCode = 'freeCashFlow'
type IncomeStatementDataCode = 'costRev' | 'netinc' | 'eps' | 'grossProfit' | 'ebitda' | 'revenue'
type OverviewDataCode = 'revenueQoQ' | 'grossMargin' | 'debtEquity' | 'roa' | 'roe' | 'epsQoQ'

export interface TiingoFinancial {
  date: string;
  quarter: number;
  statementData?: {
    balanceSheet?: {
      dataCode: BalanceSheetDataCode;
      value: number;
    }[];
    cashFlow?: {
      dataCode: CashFlowDataCode;
      value: number;
    }[];
    incomeStatement?: {
      dataCode: IncomeStatementDataCode;
      value: number;
    }[];
    overview?: {
      dataCode: OverviewDataCode;
      value: number;
    }[];
  };
}

export const getTickerFinancials = async (
  symbol: string,
  dataKey: string,
): Promise<TiingoFinancial[]> => {
  const queryParams = qs.stringify({
    token: generateTool.decodeDataKey(dataKey),
  })
  const url = `${TiingoBaseUrl}/fundamentals/${symbol}/statements?${queryParams}`
  const result = await axios.get(url)

  if (!result?.data) throw new Error('Fundamental data not exists')

  return result.data
}
