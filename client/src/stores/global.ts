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
  },
})

export const { removeMessage } = globalSlice.actions

export default globalSlice.reducer
