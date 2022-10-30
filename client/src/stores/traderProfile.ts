import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'

export interface TraderProfileBase {
  [traderId: number]: interfaces.response.TraderProfile;
}

export interface TraderProfileState {
  base: TraderProfileBase;
}

const initialState: TraderProfileState = {
  base: {},
}

const storeFromEnvDetail = (
  state: TraderProfileState,
  action: PayloadAction<{ detail: interfaces.response.EnvDetail, id: number }>,
) => {
  const topProfiles = action.payload.detail.topProfiles
  const traderProfiles = [
    ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
    ...topProfiles.pastMonth, ...topProfiles.pastWeek,
  ]
  traderProfiles.forEach((profile) => {
    state.base[profile.trader.id] = profile
  })
}

export const tickerIdentitySlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, storeFromEnvDetail)
  },
})

export default tickerIdentitySlice.reducer
