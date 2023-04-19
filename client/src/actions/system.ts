import * as interfaces from '@shared/interfaces'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import { createAsyncThunk } from '@reduxjs/toolkit'

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
