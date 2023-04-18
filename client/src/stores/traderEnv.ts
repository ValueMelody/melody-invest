import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest, _updateForTest } from 'tools/store'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TraderEnvBase {
  [envId: number]: interfaces.traderEnvModel.Identity;
}

export interface TraderEnvDetail {
  [envId: number]: {
    topProfiles: TopTraderProfileIds;
  };
}

export interface TraderEnvState {
  base: TraderEnvBase;
  detail: TraderEnvDetail;
}

const initialState: TraderEnvState = {
  base: {},
  detail: {},
}

const storeFromUserOverall = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  action.payload.traderEnvs.forEach((env) => {
    state.base[env.id] = env
  })
}

const storeFromEnvBase = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.traderEnvModel.Identity>,
) => {
  state.base[action.payload.id] = action.payload
}

const storeFromEnvDetail = (
  state: TraderEnvState,
  action: PayloadAction<{ detail: interfaces.response.EnvDetail; id: number }>,
) => {
  const topProfiles = stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[action.payload.id] = { topProfiles }
}

const removeUserFollowed = (state: TraderEnvState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    delete state.base[numKey]
    delete state.detail[numKey]
  })
}

const deleteById = (state: TraderEnvState, action: PayloadAction<number>) => {
  delete state.base[action.payload]
  delete state.detail[action.payload]
}

export const traderEnvSlice = createSlice({
  name: 'traderEnv',
  initialState,
  reducers: {
    _updateForTest,
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderEnvDetail.fulfilled, storeFromEnvDetail)
    builder.addCase(actions.createTraderEnv.fulfilled, storeFromEnvBase)
    builder.addCase(actions.deleteTraderEnv.fulfilled, deleteById)
    builder.addCase(actions.logout, removeUserFollowed)
    builder.addCase(actions.lockUserAccount.fulfilled, removeUserFollowed)
  },
})

export default traderEnvSlice.reducer
