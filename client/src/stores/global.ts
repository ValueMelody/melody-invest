import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as requestAdapter from 'adapters/request'
import * as storageAdapter from 'adapters/storage'
import { AnyAction, PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import { _resetForTest, _updateForTest } from 'tools/store'

type MessageType = 'success' | 'info' | 'warning' | 'failure'

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  desc?: string;
}

export interface GlobalState {
  accessToken: string;
  accessExpiresIn: string;
  refreshToken: string;
  refreshExpiresIn: string;
  acceptedDisclaimer: boolean;
  isLoading: boolean;
  messages: Message[];
}

const accessToken = storageAdapter.get(commonEnum.StorageKey.AccessToken) || ''
const accessExpiresIn = storageAdapter.get(commonEnum.StorageKey.AccessExpiresIn) || ''
const refreshToken = storageAdapter.get(commonEnum.StorageKey.RefreshToken) || ''
const refreshExpiresIn = storageAdapter.get(commonEnum.StorageKey.RefreshExpiresIn) || ''

const currentUTC = dateTool.getVerifyISO()
const hasValidToken = !!refreshToken && !!refreshExpiresIn && refreshExpiresIn > currentUTC
if (hasValidToken) requestAdapter.setAuthToken(accessToken)

const initialState: GlobalState = {
  accessToken: hasValidToken ? accessToken : '',
  accessExpiresIn: hasValidToken ? accessExpiresIn : '',
  refreshToken: hasValidToken ? refreshToken : '',
  refreshExpiresIn: hasValidToken ? refreshExpiresIn : '',
  acceptedDisclaimer: hasValidToken,
  isLoading: false,
  messages: [],
}

const startLoading = (state: GlobalState) => {
  state.isLoading = true
}

const stopLoading = (state: GlobalState) => {
  state.isLoading = false
}

const acceptDisclaimer = (state: GlobalState) => {
  state.acceptedDisclaimer = true
}

const successWithMessage = (
  state: GlobalState,
  action: PayloadAction<{ msg: string }>,
) => {
  state.isLoading = false
  state.messages = [
    ...state.messages,
    {
      id: nanoid(),
      title: action.payload.msg,
      type: 'success',
    },
  ]
}

const addMessage = (
  state: GlobalState,
  action: PayloadAction<{ title: string; type: MessageType }>,
) => {
  state.messages = [
    ...state.messages,
    {
      id: nanoid(),
      title: action.payload.title,
      type: action.payload.type,
    },
  ]
}

const removeMessage = (state: GlobalState, action: PayloadAction<string>) => {
  const messages = state.messages.filter((message) => message.id !== action.payload)
  state.messages = messages
}

const logout = (state: GlobalState) => {
  requestAdapter.setAuthToken('')
  storageAdapter.remove(commonEnum.StorageKey.AccessToken)
  storageAdapter.remove(commonEnum.StorageKey.AccessExpiresIn)
  storageAdapter.remove(commonEnum.StorageKey.RefreshToken)
  storageAdapter.remove(commonEnum.StorageKey.RefreshExpiresIn)
  state.accessToken = ''
  state.accessExpiresIn = ''
  state.refreshToken = ''
  state.refreshExpiresIn = ''
  state.acceptedDisclaimer = false
}

const storeAccessToken = (
  state: GlobalState,
  accessToken: interfaces.response.AccessToken,
) => {
  requestAdapter.setAuthToken(accessToken.accessToken)
  storageAdapter.set(commonEnum.StorageKey.AccessToken, accessToken.accessToken)
  storageAdapter.set(commonEnum.StorageKey.AccessExpiresIn, accessToken.accessExpiresIn)
  state.accessToken = accessToken.accessToken
  state.accessExpiresIn = accessToken.accessExpiresIn
}

const storeAuthToken = (
  state: GlobalState,
  userToken: interfaces.response.UserToken,
) => {
  storeAccessToken(state, {
    accessToken: userToken.accessToken,
    accessExpiresIn: userToken.accessExpiresIn,
  })
  storageAdapter.set(commonEnum.StorageKey.RefreshToken, userToken.refreshToken)
  storageAdapter.set(commonEnum.StorageKey.RefreshExpiresIn, userToken.refreshExpiresIn)
  state.refreshToken = userToken.refreshToken
  state.refreshExpiresIn = userToken.refreshExpiresIn
}

const lockUserAccount = (state: GlobalState, action: PayloadAction<{ msg: string }>) => {
  logout(state)
  successWithMessage(state, action)
}

const onRequestRejected = (state: GlobalState, action: AnyAction) => {
  const message = action?.payload?.message || localeTool.t('error.500')

  if (message === localeTool.t('error.401')) logout(state)

  state.isLoading = false
  state.messages = [
    ...state.messages,
    {
      id: nanoid(),
      title: message,
      type: 'failure',
    },
  ]
}

const onCreatePaymentFailed = (state: GlobalState) => {
  state.isLoading = false
  state.messages = [
    ...state.messages,
    {
      id: nanoid(),
      title: localeTool.t('setting.paymentFailed', {
        email: commonEnum.Env.ContactEmail,
      }),
      type: 'failure',
    },
  ]
}

const onCreateUserToken = (
  state: GlobalState,
  action: PayloadAction<interfaces.response.UserToken>,
) => {
  state.isLoading = false
  storeAuthToken(state, action.payload)
}

const onRefreshAccessToken = (
  state: GlobalState,
  action: PayloadAction<interfaces.response.AccessToken | null>,
) => {
  state.isLoading = false
  if (action.payload !== null) storeAccessToken(state, action.payload)
}

const onCreatePayment = (
  state: GlobalState,
  action: PayloadAction<{
    userToken: interfaces.response.UserToken;
    msg: string;
  }>,
) => {
  storeAuthToken(state, action.payload.userToken)
  successWithMessage(state, action)
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    removeMessage,
    addMessage,
    onCreatePaymentFailed,
    onCreateUserToken,
    onRequestRejected,
    startLoading,
    stopLoading,
    _updateForTest,
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.createUserPayment.fulfilled, onCreatePayment)
    builder.addCase(actions.lockUserAccount.fulfilled, lockUserAccount)
    builder.addCase(actions.logout, logout)
    builder.addCase(actions.acceptDisclaimer, acceptDisclaimer)

    builder.addCase(actions.createUserToken.pending, startLoading)
    builder.addCase(actions.createUserToken.fulfilled, onCreateUserToken)
    builder.addCase(actions.createUserToken.rejected, onRequestRejected)

    builder.addCase(actions.refreshAccessToken.pending, startLoading)
    builder.addCase(actions.refreshAccessToken.fulfilled, onRefreshAccessToken)

    builder.addCase(actions.fetchSystemPolicy.pending, startLoading)
    builder.addCase(actions.fetchSystemPolicy.fulfilled, stopLoading)
    builder.addCase(actions.fetchSystemPolicy.rejected, onRequestRejected)

    builder.addCase(actions.fetchUserOverall.pending, startLoading)
    builder.addCase(actions.fetchUserOverall.fulfilled, stopLoading)
    builder.addCase(actions.fetchUserOverall.rejected, onRequestRejected)

    builder.addCase(actions.fetchUserEntity.pending, startLoading)
    builder.addCase(actions.fetchUserEntity.fulfilled, stopLoading)
    builder.addCase(actions.fetchUserEntity.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderEnvDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderEnvDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderComboDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderComboDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderBehaviorDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderBehaviorDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderProfile.pending, startLoading)
    builder.addCase(actions.fetchTraderProfile.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderProfile.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderProfileDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderProfileDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderProfileDetail.rejected, onRequestRejected)

    builder.addCase(actions.deleteTraderCombo.pending, startLoading)
    builder.addCase(actions.deleteTraderCombo.fulfilled, stopLoading)
    builder.addCase(actions.deleteTraderCombo.rejected, onRequestRejected)

    builder.addCase(actions.deleteTraderEnv.pending, startLoading)
    builder.addCase(actions.deleteTraderEnv.fulfilled, stopLoading)
    builder.addCase(actions.deleteTraderEnv.rejected, onRequestRejected)

    builder.addCase(actions.deleteWatchedProfile.pending, startLoading)
    builder.addCase(actions.deleteWatchedProfile.fulfilled, stopLoading)
    builder.addCase(actions.deleteWatchedProfile.rejected, onRequestRejected)

    builder.addCase(actions.createWatchedProfile.pending, startLoading)
    builder.addCase(actions.createWatchedProfile.fulfilled, stopLoading)
    builder.addCase(actions.createWatchedProfile.rejected, onRequestRejected)

    builder.addCase(actions.createTicker.pending, startLoading)
    builder.addCase(actions.createTicker.fulfilled, stopLoading)
    builder.addCase(actions.createTicker.rejected, onRequestRejected)

    builder.addCase(actions.createTraderEnv.pending, startLoading)
    builder.addCase(actions.createTraderEnv.fulfilled, stopLoading)
    builder.addCase(actions.createTraderEnv.rejected, onRequestRejected)

    builder.addCase(actions.createTraderCombo.pending, startLoading)
    builder.addCase(actions.createTraderCombo.fulfilled, stopLoading)
    builder.addCase(actions.createTraderCombo.rejected, onRequestRejected)

    builder.addCase(actions.createTraderProfile.pending, startLoading)
    builder.addCase(actions.createTraderProfile.fulfilled, stopLoading)
    builder.addCase(actions.createTraderProfile.rejected, onRequestRejected)

    builder.addCase(actions.createResetEmail.pending, startLoading)
    builder.addCase(actions.createResetEmail.fulfilled, successWithMessage)
    builder.addCase(actions.createResetEmail.rejected, onRequestRejected)

    builder.addCase(actions.updateUserPassword.pending, startLoading)
    builder.addCase(actions.updateUserPassword.fulfilled, successWithMessage)
    builder.addCase(actions.updateUserPassword.rejected, onRequestRejected)

    builder.addCase(actions.updateUserEntity.pending, startLoading)
    builder.addCase(actions.updateUserEntity.fulfilled, successWithMessage)
    builder.addCase(actions.updateUserEntity.rejected, onRequestRejected)

    builder.addCase(actions.lockUserAccount.pending, startLoading)
    builder.addCase(actions.lockUserAccount.rejected, onRequestRejected)

    builder.addCase(actions.resetUserPassword.pending, startLoading)
    builder.addCase(actions.resetUserPassword.fulfilled, successWithMessage)
    builder.addCase(actions.resetUserPassword.rejected, onRequestRejected)

    builder.addCase(actions.cancelUserSubscription.pending, startLoading)
    builder.addCase(actions.cancelUserSubscription.fulfilled, successWithMessage)
    builder.addCase(actions.cancelUserSubscription.rejected, onRequestRejected)

    builder.addCase(actions.createUser.pending, startLoading)
    builder.addCase(actions.createUser.fulfilled, successWithMessage)
    builder.addCase(actions.createUser.rejected, onRequestRejected)

    builder.addCase(actions.activateUser.pending, startLoading)
    builder.addCase(actions.activateUser.fulfilled, successWithMessage)
    builder.addCase(actions.activateUser.rejected, onRequestRejected)

    builder.addCase(actions.createUserPayment.pending, startLoading)
    builder.addCase(actions.createUserPayment.rejected, onCreatePaymentFailed)
  },
})

export default globalSlice.reducer
