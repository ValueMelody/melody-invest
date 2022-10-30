import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TraderEnvBase {
  [envId: number]: interfaces.traderEnvModel.Record;
}

export interface TraderEnvDetail {
  [envId: number]: {
    topProfiles: TopTraderProfileIds
  }
}

export interface TraderEnvState {
  base: TraderEnvBase;
  detail: TraderEnvDetail;
}

const initialState: TraderEnvState = {
  base: {},
  detail: {},
}

const storeFromSystemDefaults = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.traderEnvs.forEach((env) => {
    state.base[env.id] = env
  })
}

const storeFromUserOverall = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  action.payload.traderEnvs.forEach((env) => {
    state.base[env.id] = env
  })
}

const storeFromEnvDetail = (
  state: TraderEnvState,
  action: PayloadAction<{ detail: interfaces.response.EnvDetail, id: number }>,
) => {
  const topProfiles = stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[action.payload.id] = { topProfiles }
}

export const traderEnvSlice = createSlice({
  name: 'traderEnv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeFromSystemDefaults)
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, storeFromEnvDetail)
  },
})

export default traderEnvSlice.reducer
