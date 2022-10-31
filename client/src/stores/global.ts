import { nanoid, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as localeTool from 'tools/locale'

export interface Message {
  id: string;
  type: 'success' | 'info' | 'warning' | 'failure';
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

const onRequestRejected = (state: GlobalState) => {
  const message = localeTool.t('error.500')
  state.isLoading = false
  state.messages.push({
    id: nanoid(),
    title: message,
    type: 'failure',
  })
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    removeMessage: (state: GlobalState, action: PayloadAction<string>) => {
      const messages = state.messages.filter((message) => message.id !== action.payload)
      state.messages = messages
    },
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
  },
})

export const { removeMessage } = globalSlice.actions

export default globalSlice.reducer
