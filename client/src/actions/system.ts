import * as interfaces from '@shared/interfaces'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchSystemDefaults = createAsyncThunk(
  'system/fetchSystemDefaults',
  async (params, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/defaults`

    try {
      const res: interfaces.response.SystemDefaults = await requestAdapter.sendGetRequest(endpoint)
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchSystemPolicy = createAsyncThunk(
  'system/fetchSystemPolicy',
  async (type: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/policy/${type}`

    try {
      const res: interfaces.policyModel.Record = await requestAdapter.sendGetRequest(endpoint)
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const fetchSystemTopTraders = createAsyncThunk(
  'system/fetchSystemTopTraders',
  async (params, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/top-trader-profiles`

    try {
      const res: interfaces.response.TopTraderProfiles = await requestAdapter.sendGetRequest(endpoint)
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
