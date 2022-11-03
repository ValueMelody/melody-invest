import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import stripTopProfiles from './shared/stripTopProfiles'

export interface TraderBehaviorDetail {
  [key: string]: {
    topProfiles: TopTraderProfileIds
  }
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, storeFromBehaviorDetail)
  },
})

export default traderBehaviorSlice.reducer