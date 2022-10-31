import { createAsyncThunk } from '@reduxjs/toolkit'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as interfaces from '@shared/interfaces'

export const fetchTraderEnvDetail = createAsyncThunk(
  'trader/fetchTraderEnvDetail',
  async (envId: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}`
    const res: interfaces.response.EnvDetail = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return {
      detail: res,
      id: envId,
    }
  },
)

export const fetchTraderTickerDetail = createAsyncThunk(
  'trader/fetchTraderTickerDetail',
  async ({
    envId,
    tickerId,
  }: {
    envId: number;
    tickerId: number;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}/tickers/${tickerId}`
    const res: interfaces.response.TickerDetail = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return {
      detail: res,
      envId,
      tickerId,
    }
  },
)

export const fetchTraderComboDetail = createAsyncThunk(
  'trader/fetchTraderComboDetail',
  async (comboId: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos/${comboId}`
    const res: interfaces.response.ComboDetail = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return {
      detail: res,
      id: comboId,
    }
  },
)
