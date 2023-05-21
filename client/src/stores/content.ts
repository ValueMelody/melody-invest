import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as storeTool from 'tools/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface ContentState {
  privacyPolicy?: interfaces.policyModel.Record;
  termsPolicy?: interfaces.policyModel.Record;
  activeTraderChartIndex: number;
}

const initialState: ContentState = {
  activeTraderChartIndex: 0,
  privacyPolicy: undefined,
  termsPolicy: undefined,
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

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    storePolicy,
    changeActiveTraderChartIndex,
    _updateForTest: storeTool._updateForTest,
    _resetForTest: (state) => storeTool._resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemPolicy.fulfilled, storePolicy)
  },
})

export default contentSlice.reducer
