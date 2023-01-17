import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest } from 'tools/store'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TraderBehaviorDetail {
  [key: string]: {
    topProfiles: TopTraderProfileIds;
  };
}

export interface TraderBehaviorState {
  detail: TraderBehaviorDetail;
}

const initialState: TraderBehaviorState = {
  detail: {},
}

const storeFromBehaviorDetail = (
  state: TraderBehaviorState,
  action: PayloadAction<{
    detail: interfaces.response.BehaviorDetail;
    envId: number;
    behavior: interfaces.traderPatternModel.Behavior;
  }>,
) => {
  const topProfiles = stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[`${action.payload.envId}-${action.payload.behavior}`] = { topProfiles }
}

export const traderBehaviorSlice = createSlice({
  name: 'traderBehavior',
  initialState,
  reducers: {
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, storeFromBehaviorDetail)
  },
})

export default traderBehaviorSlice.reducer
