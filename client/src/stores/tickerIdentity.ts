import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest } from 'tools/store'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TickerIdentityBase {
  [tickerId: number]: interfaces.tickerModel.Record;
}

export interface TraderIdentityDetail {
  [key: string]: {
    topProfiles: TopTraderProfileIds;
  };
}

export interface TickerIdentityState {
  base: TickerIdentityBase;
  detail: TraderIdentityDetail;
}

const initialState: TickerIdentityState = {
  base: {},
  detail: {},
}

const storeFromSystemDefaults = (
  state: TickerIdentityState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.tickers.forEach((ticker) => {
    state.base[ticker.id] = ticker
  })
}

const storeFromTickerDetail = (
  state: TickerIdentityState,
  action: PayloadAction<{ envId: number; tickerId: number; detail: interfaces.response.TickerDetail }>,
) => {
  const topProfiles = stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[`${action.payload.envId}-${action.payload.tickerId}`] = { topProfiles }
}

export const tickerIdentitySlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeFromSystemDefaults)
    builder.addCase(actions.fetchTraderTickerDetail.fulfilled, storeFromTickerDetail)
  },
})

export default tickerIdentitySlice.reducer
