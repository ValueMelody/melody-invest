import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export interface ContentState {
  privacyPolicy?: interfaces.policyModel.Record;
  termsPolicy?: interfaces.policyModel.Record;
}

const initialState: ContentState = {}

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

export const contentSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    storePolicy,
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemPolicy.fulfilled, storePolicy)
  },
})

export default contentSlice.reducer
