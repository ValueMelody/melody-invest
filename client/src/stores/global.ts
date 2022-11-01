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
  console.log(action.payload)
  const message = localeTool.t('error.500')
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
  },
})

export default globalSlice.reducer
