import { createAsyncThunk } from '@reduxjs/toolkit'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as interfaces from '@shared/interfaces'

export const fetchUserOverall = createAsyncThunk(
  'user/fetchUserOverall',
  async (params, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/overall`
    const res: interfaces.response.UserOverall = await requestAdapter.sendGetRequest(endpoint)

    if (!res) rejectWithValue(res)

    return res
  },
)
