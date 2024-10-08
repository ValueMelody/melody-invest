import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as storeTool from 'tools/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface TraderProfileBase {
  [traderId: number]: interfaces.response.TraderProfile;
}

export interface TraderProfileDetail {
  [traderId: number]: interfaces.response.ProfileDetail;
}

export interface TraderProfileState {
  base: TraderProfileBase;
  detail: TraderProfileDetail;
}

const initialState: TraderProfileState = {
  base: {},
  detail: {},
}

const storeFromDetailTops = (
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
  action: PayloadAction<{ detail: interfaces.response.ComboDetail }>,
) => {
  const profiles = action.payload.detail.profiles
  profiles.forEach((profile) => {
    state.base[profile.trader.id] = profile
  })
}

const storeFromUserOverall = (
  state: TraderProfileState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  action.payload.traderProfiles.forEach((profile) => {
    state.base[profile.trader.id] = profile
  })
}

const storeFromTraderProfile = (
  state: TraderProfileState,
  action: PayloadAction<interfaces.response.TraderProfile>,
) => {
  state.base[action.payload.trader.id] = action.payload
}

const storeFromProfileDetail = (
  state: TraderProfileState,
  action: PayloadAction<{ id: number; detail: interfaces.response.ProfileDetail }>,
) => {
  state.detail[action.payload.id] = action.payload.detail
}

const remove = (state: TraderProfileState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    delete state.base[numKey]
    delete state.detail[numKey]
  })
}

export const traderProfileSlice = createSlice({
  name: 'traderProfile',
  initialState,
  reducers: {
    _resetForTest: (state) => storeTool._resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, storeFromDetailTops)
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, storeFromDetailTops)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, storeFromComboDetail)
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderProfile.fulfilled, storeFromTraderProfile)
    builder.addCase(actions.createTraderProfile.fulfilled, storeFromTraderProfile)
    builder.addCase(actions.fetchTraderProfileDetail.fulfilled, storeFromProfileDetail)
    builder.addCase(actions.logout, remove)
  },
})

export default traderProfileSlice.reducer
