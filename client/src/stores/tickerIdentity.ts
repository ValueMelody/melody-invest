import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as storeTool from 'tools/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface TickerIdentityBase {
  [tickerId: number]: interfaces.tickerModel.Record;
}

export interface TickerIdentityState {
  base: TickerIdentityBase;
}

const initialState: TickerIdentityState = {
  base: {},
}

const storeFromCreate = (
  state: TickerIdentityState,
  action: PayloadAction<interfaces.tickerModel.Record>,
) => {
  state.base[action.payload.id] = action.payload
}

const storeFromUserOverall = (
  state: TickerIdentityState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  action.payload.tickers.forEach((ticker) => {
    state.base[ticker.id] = ticker
  })
}

const remove = (state: TickerIdentityState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    delete state.base[numKey]
  })
}

export const tickerIdentitySlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {
    _resetForTest: (state) => storeTool._resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.createTicker.fulfilled, storeFromCreate)
    builder.addCase(actions.logout, remove)
  },
})

export default tickerIdentitySlice.reducer
