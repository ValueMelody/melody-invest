import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export interface ContentState {
  privacyPolicy?: interfaces.policyModel.Record;
  termsPolicy?: interfaces.policyModel.Record;
  activeTraderChartIndex: number;
}

const initialState: ContentState = {
  activeTraderChartIndex: 0,
}

const storePolicy = (
  state: ContentState,
  action: PayloadAction<interfaces.policyModel.Record>,
) => {
  if (action.payload.type === constants.Content.PolicyType.Privacy) {
    state.privacyPolicy = action.payload
  } else if (action.payload.type === constants.Content.PolicyType.TermsAndConditions) {
    state.termsPolicy = action.payload
  }
}

const changeActiveTraderChartIndex = (
  state: ContentState,
  action: PayloadAction<number>,
) => {
  state.activeTraderChartIndex = action.payload
}

const _updateForTest = (
  state: any,
  action: any,
) => {
  Object.keys(action.payload).forEach((key) => {
    state[key] = action.payload[key]
  })
}

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    storePolicy,
    changeActiveTraderChartIndex,
    _updateForTest,
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemPolicy.fulfilled, storePolicy)
  },
})

export default contentSlice.reducer
