import { createAsyncThunk } from '@reduxjs/toolkit'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as interfaces from '@shared/interfaces'

export const fetchSystemDefaults = createAsyncThunk(
  'system/fetchSystemDefaults',
  async (params, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/defaults`
    const res: interfaces.response.SystemDefaults = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return res
  },
)

export const fetchSystemPolicy = createAsyncThunk(
  'system/fetchSystemPolicy',
  async (type: number, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/policy/${type}`
    const res: interfaces.policyModel.Record = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return res
  },
)
