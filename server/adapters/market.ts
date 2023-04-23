import * as adapterEnum from 'enums/adapter'
import * as marketEnum from 'enums/market'
import axios from 'axios'
import qs from 'qs'

export const getCoolDownSeconds = (): number => {
  return adapterEnum.MarketConfig.CooldownSeconds || 1
}

export interface AnnualEarning {
  fiscalDateEnding: string;
  reportedEPS: string;
}

export interface QuarterlyEarning {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: string;
  estimatedEPS: string;
  surprise: string;
  surprisePercentage: string;
}

interface TickerEarnings {
  annualEarnings: AnnualEarning[];
  quarterlyEarnings: QuarterlyEarning[];
}

export const getTickerEarnings = async (
  symbol: string,
): Promise<TickerEarnings> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Earnings,
    symbol: symbol.toUpperCase(),
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

export interface Income {
  fiscalDateEnding: string;
  grossProfit: string;
  totalRevenue: string;
  costOfRevenue: string;
  ebitda: string;
  netIncome: string;
}

interface TickerIncomes {
  annualReports: Income[];
  quarterlyReports: Income[];
}

export const getTickerIncomes = async (
  symbol: string,
): Promise<TickerIncomes> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Incomes,
    symbol: symbol.toUpperCase(),
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)

  if (result.data.Note) throw result.data
  return result.data
}

interface IndicatorDateValue {
  date: string;
  value: string;
}

export const getRealGDP = async (
  interval: string,
): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.GDP,
    interval,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getFundsRate = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.FundsRate,
    interval: 'monthly',
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getCPI = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.CPI,
    interval: 'monthly',
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getTreasuryYield = async (
  type: string,
): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.TreasuryYield,
    interval: 'monthly',
    maturity: type,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getInflation = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.Inflation,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getRetailSales = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.RetailSales,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getDurableGoods = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.DurableGoods,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getUnemploymentRate = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.UnemploymentRate,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}

export const getNonfarmPayroll = async (): Promise<{
  data: IndicatorDateValue[];
}> => {
  const queryParams = qs.stringify({
    function: marketEnum.Type.NonfarmPayroll,
    apikey: adapterEnum.MarketConfig.Key,
  })
  const url = `${adapterEnum.MarketConfig.BaseUrl}?${queryParams}`
  const result = await axios.get(url)
  if (result.data.Note) throw result.data
  return result.data
}
