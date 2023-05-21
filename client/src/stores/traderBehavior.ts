import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as storeTool from 'tools/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
  const topProfiles = storeTool.stripTopProfiles(action.payload.detail.topProfiles)
  state.detail[`${action.payload.envId}-${action.payload.behavior}`] = { topProfiles }
}

const remove = (state: TraderBehaviorState) => {
  Object.keys(state.detail).forEach((key: string) => {
    const numKey = Number(key)
    delete state.detail[numKey]
  })
}

export const traderBehaviorSlice = createSlice({
  name: 'traderBehavior',
  initialState,
  reducers: {
    _resetForTest: (state) => storeTool._resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchTraderBehaviorDetail.fulfilled, storeFromBehaviorDetail)
    builder.addCase(actions.logout, remove)
  },
})

export default traderBehaviorSlice.reducer
