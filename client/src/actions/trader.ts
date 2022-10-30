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
