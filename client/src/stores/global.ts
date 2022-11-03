import { nanoid, createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as localeTool from 'tools/locale'
import { _updateForTest, _resetForTest } from 'tools/store'

type MessageType = 'success' | 'info' | 'warning' | 'failure'

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  desc?: string;
}

export interface GlobalState {
  isLoading: boolean;
  messages: Message[];
}

const initialState: GlobalState = {
  isLoading: false,
  messages: [],
}

const startLoading = (state: GlobalState) => {
  state.isLoading = true
}

const stopLoading = (state: GlobalState) => {
  state.isLoading = false
}

const onRequestRejected = (state: GlobalState, action: AnyAction) => {
  let message = action?.payload?.message || localeTool.t('error.500')
  if (message === 'Unauthorized') message = localeTool.t('error.401')
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

const successWithMessage = (
  state: GlobalState,
  action: PayloadAction<{ msg: string; }>,
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
  action: PayloadAction<{ title: string; type: MessageType; }>,
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

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    removeMessage, addMessage, _updateForTest, _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemPolicy.pending, startLoading)
    builder.addCase(actions.fetchSystemPolicy.fulfilled, stopLoading)
    builder.addCase(actions.fetchSystemPolicy.rejected, onRequestRejected)

    builder.addCase(actions.fetchSystemDefaults.pending, startLoading)
    builder.addCase(actions.fetchSystemDefaults.fulfilled, stopLoading)
    builder.addCase(actions.fetchSystemDefaults.rejected, onRequestRejected)

    builder.addCase(actions.fetchUserOverall.pending, startLoading)
    builder.addCase(actions.fetchUserOverall.fulfilled, stopLoading)
    builder.addCase(actions.fetchUserOverall.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderEnvDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderEnvDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderTickerDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderTickerDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderTickerDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderComboDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderComboDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderBehaviorDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderBehaviorDetail.rejected, onRequestRejected)

    builder.addCase(actions.fetchSystemTopTraders.pending, startLoading)
    builder.addCase(actions.fetchSystemTopTraders.fulfilled, stopLoading)
    builder.addCase(actions.fetchSystemTopTraders.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderProfile.pending, startLoading)
    builder.addCase(actions.fetchTraderProfile.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderProfile.rejected, onRequestRejected)

    builder.addCase(actions.fetchTraderProfileDetail.pending, startLoading)
    builder.addCase(actions.fetchTraderProfileDetail.fulfilled, stopLoading)
    builder.addCase(actions.fetchTraderProfileDetail.rejected, onRequestRejected)

    builder.addCase(actions.createUserToken.pending, startLoading)
    builder.addCase(actions.createUserToken.fulfilled, stopLoading)
    builder.addCase(actions.createUserToken.rejected, onRequestRejected)

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

    builder.addCase(actions.lockUserAccount.pending, startLoading)
    builder.addCase(actions.lockUserAccount.fulfilled, successWithMessage)
    builder.addCase(actions.lockUserAccount.rejected, onRequestRejected)

    builder.addCase(actions.resetUserPassword.pending, startLoading)
    builder.addCase(actions.resetUserPassword.fulfilled, successWithMessage)
    builder.addCase(actions.resetUserPassword.rejected, onRequestRejected)

    builder.addCase(actions.cancelUserSubscription.pending, startLoading)
    builder.addCase(actions.cancelUserSubscription.fulfilled, successWithMessage)
    builder.addCase(actions.cancelUserSubscription.rejected, onRequestRejected)
  },
})

export default globalSlice.reducer
