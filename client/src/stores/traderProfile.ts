import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TraderProfileBase {
  [traderId: number]: interfaces.response.TraderProfile;
}

export interface TraderProfileState {
  base: TraderProfileBase;
  systemTops?: TopTraderProfileIds;
}

const initialState: TraderProfileState = {
  base: {},
}

const storeFromDetail = (
  state: TraderProfileState,
  action: PayloadAction<{ detail: { topProfiles: interfaces.response.TopTraderProfiles } }>,
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

const storeFromComboDetail = (
  state: TraderProfileState,
  action: PayloadAction<{ detail: interfaces.response.ComboDetail; }>,
) => {
  const profiles = action.payload.detail.profiles
  profiles.forEach((profile) => {
    state.base[profile.trader.id] = profile
  })
}

const storeFromSystemCombos = (
  state: TraderProfileState,
  action: PayloadAction<interfaces.response.ComboProfile[]>,
) => {
  action.payload.forEach((comboProfile) => {
    comboProfile.detail.profiles.forEach((profile) => {
      state.base[profile.trader.id] = profile
    })
  })
}

const storeFromSystemTops = (
  state: TraderProfileState,
  action: PayloadAction<interfaces.response.TopTraderProfiles>,
) => {
  const profiles = [
    ...action.payload.yearly, ...action.payload.pastYear, ...action.payload.pastQuarter,
    ...action.payload.pastMonth, ...action.payload.pastWeek,
  ]
  profiles.forEach((profile) => {
    state.base[profile.trader.id] = profile
  })
  const tops = stripTopProfiles(action.payload)
  state.systemTops = tops
}

export const traderProfileSlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, storeFromDetail)
    builder.addCase(actions.fetchTraderTickerDetail.fulfilled, storeFromDetail)
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, storeFromDetail)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, storeFromComboDetail)
    builder.addCase(actions.fetchSystemTraderCombos.fulfilled, storeFromSystemCombos)
    builder.addCase(actions.fetchSystemTopTraders.fulfilled, storeFromSystemTops)
  },
})

export default traderProfileSlice.reducer
