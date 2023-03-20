import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { refreshAccessToken } from './general'

export const fetchUserOverall = createAsyncThunk(
  'user/fetchUserOverall',
  async (params, { rejectWithValue, dispatch }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/overall`
    await dispatch(refreshAccessToken())

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
      return {
        msg: localeTool.t('reset.emailSent'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }, { rejectWithValue, dispatch }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/password`
    await dispatch(refreshAccessToken())

    try {
      await requestAdapter.sendPutRequest(endpoint, {
        currentPassword, newPassword,
      })
      return {
        msg: localeTool.t('account.passwordUpdated'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const lockUserAccount = createAsyncThunk(
  'user/lockUserAccount',
  async (params, { rejectWithValue, dispatch }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/lock`
    await dispatch(refreshAccessToken())

    try {
      await requestAdapter.sendPutRequest(endpoint)
      return {
        msg: localeTool.t('setting.lockAccessSuccess'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const resetUserPassword = createAsyncThunk(
  'user/resetUserPassword',
  async ({
    email,
    password,
    resetCode,
  }: {
    email: string;
    password: string;
    resetCode: string;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/reset`

    try {
      await requestAdapter.sendPutRequest(endpoint, {
        email, password, resetCode,
      })
      return {
        msg: localeTool.t('account.passwordUpdated'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const cancelUserSubscription = createAsyncThunk(
  'user/cancelUserSubscription',
  async (params, { rejectWithValue, dispatch }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/subscription`
    await dispatch(refreshAccessToken())

    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      return {
        msg: localeTool.t('setting.unsubscribeSuccess'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async ({
    email,
    password,
    isConfirmed,
  }: {
    email: string;
    password: string;
    isConfirmed: boolean;
  }, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}`

    try {
      await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        isConfirmed,
      })
      return {
        msg: localeTool.t('signUp.success'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const activateUser = createAsyncThunk(
  'user/activateUser',
  async (token: string, { rejectWithValue }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/activate`

    try {
      await requestAdapter.sendPutRequest(endpoint, { token })
      return {
        msg: localeTool.t('activate.success'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const createUserPayment = createAsyncThunk(
  'user/createUserPayment',
  async ({
    orderId,
    planType,
    stateCode,
    provinceCode,
  }: {
    orderId: string;
    planType: number;
    stateCode: string;
    provinceCode: string;
  }, { rejectWithValue, dispatch }) => {
    const endpoint = `${routerEnum.Endpoint.Users}/payment`
    await dispatch(refreshAccessToken())

    try {
      const userToken: interfaces.response.UserToken = await requestAdapter.sendPostRequest(endpoint, {
        orderId,
        planType,
        stateCode,
        provinceCode,
      })
      return {
        userToken,
        planType,
        msg: localeTool.t('setting.subscribeSucceed'),
      }
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)
