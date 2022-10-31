import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TickerIdentityBase {
  [tickerId: number]: interfaces.tickerModel.Identity;
}

export interface TraderIdentityDetail {
  [key: string]: {
    topProfiles: TopTraderProfileIds
  }
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
  action.payload.tickerIdentities.forEach((ticker) => {
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeFromSystemDefaults)
    builder.addCase(actions.fetchTraderTickerDetail.fulfilled, storeFromTickerDetail)
  },
})

export default tickerIdentitySlice.reducer
