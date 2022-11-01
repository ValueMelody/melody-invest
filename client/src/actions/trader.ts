import { createAsyncThunk } from '@reduxjs/toolkit'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as interfaces from '@shared/interfaces'

export const fetchTraderProfile = createAsyncThunk(
  'trader/fetchTraderProfile',
  async ({
    id,
    accessCode,
  }: {
    id: number;
    accessCode: string;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${id}/${accessCode}`

    try {
      const res: interfaces.response.TraderProfile = await requestAdapter.sendGetRequest(endpoint)
      return {
        detail: res,
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchTraderProfileDetail = createAsyncThunk(
  'trader/fetchTraderProfileDetail',
  async ({
    id,
    accessCode,
  }: {
    id: number;
    accessCode: string;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${id}/${accessCode}/detail`

    try {
      const res: interfaces.response.ProfileDetail = await requestAdapter.sendGetRequest(endpoint)
      return {
        id,
        detail: res,
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchTraderEnvDetail = createAsyncThunk(
  'trader/fetchTraderEnvDetail',
  async (envId: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}`

    try {
      const res: interfaces.response.EnvDetail = await requestAdapter.sendGetRequest(endpoint)
      return {
        detail: res,
        id: envId,
      }
    } catch (e) {
      return rejectWithValue(e)
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

    try {
      const res: interfaces.response.TickerDetail = await requestAdapter.sendGetRequest(endpoint)
      return {
        detail: res,
        envId,
        tickerId,
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchTraderBehaviorDetail = createAsyncThunk(
  'trader/fetchTraderBehaviorDetail',
  async ({
    envId,
    behavior,
  }: {
    envId: number;
    behavior: interfaces.traderPatternModel.Behavior;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}/behaviors/${behavior}`

    try {
      const res: interfaces.response.BehaviorDetail = await requestAdapter.sendGetRequest(endpoint)
      return {
        detail: res,
        envId,
        behavior,
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchTraderComboDetail = createAsyncThunk(
  'trader/fetchTraderComboDetail',
  async (comboId: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos/${comboId}`

    try {
      const res: interfaces.response.ComboDetail = await requestAdapter.sendGetRequest(endpoint)
      return {
        detail: res,
        id: comboId,
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
