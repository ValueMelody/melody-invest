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

const storeFromCreate = (
  state: TickerIdentityState,
  action: PayloadAction<interfaces.tickerModel.Record>,
) => {
  state.base[action.payload.id] = action.payload
}

const storeFromTickerDetail = (
  state: TickerIdentityState,
  action: PayloadAction<{ envId: number; tickerId: number; detail: interfaces.response.TickerDetail }>,
) => {
  const topProfiles = stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[`${action.payload.envId}-${action.payload.tickerId}`] = { topProfiles }
}

const remove = (state: TickerIdentityState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    delete state.base[numKey]
    delete state.detail[numKey]
  })
}

export const tickerIdentitySlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.createTicker.fulfilled, storeFromCreate)
    builder.addCase(actions.fetchTraderTickerDetail.fulfilled, storeFromTickerDetail)
    builder.addCase(actions.logout, remove)
  },
})

export default tickerIdentitySlice.reducer
