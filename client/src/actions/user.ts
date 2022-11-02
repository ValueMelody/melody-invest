import { createAsyncThunk } from '@reduxjs/toolkit'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as interfaces from '@shared/interfaces'

export const fetchUserOverall = createAsyncThunk(
  'user/fetchUserOverall',
  async (params, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/overall`

    try {
      const res: interfaces.response.UserOverall = await requestAdapter.sendGetRequest(endpoint)
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const createUserToken = createAsyncThunk(
  'user/createUserToken',
  async ({
    email,
    password,
    shouldRemember,
  }: {
    email: string;
    password: string;
    shouldRemember: boolean;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/token`

    try {
      const res: interfaces.response.UserToken = await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        remember: shouldRemember,
      })
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const createResetEmail = createAsyncThunk(
  'user/createResetEmail',
  async (email: string, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/reset`

    try {
      await requestAdapter.sendPostRequest(endpoint, { email })
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
