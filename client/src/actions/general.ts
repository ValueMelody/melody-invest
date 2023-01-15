import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

export const logout = createAction('general/logout')

export const refreshAccessToken = createAsyncThunk(
  'general/refreshAccessToken',
  async (params, { rejectWithValue, getState }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/token`
    const state = getState() as AppState
    const accessExpiresIn = state.global.accessExpiresIn
    const refreshExpiresIn = state.global.refreshExpiresIn
    const refreshToken = state.global.refreshToken
    const verifyISO = dateTool.getVerifyISO()

    if (!refreshToken || accessExpiresIn > verifyISO || refreshExpiresIn <= verifyISO) return null

    try {
      requestAdapter.setAuthToken(refreshToken)
      const res: interfaces.response.AccessToken = await requestAdapter.sendPutRequest(
        endpoint,
        undefined,
      )
      return res
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
