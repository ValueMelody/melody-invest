import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'

export interface TickerIdentityBase {
  [tickerId: number]: interfaces.tickerModel.Identity;
}

export interface TickerIdentityState {
  base: TickerIdentityBase;
}

const initialState: TickerIdentityState = {
  base: {},
}

const storeIdentityBases = (
  state: TickerIdentityState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.tickerIdentities.forEach((ticker) => {
    state.base[ticker.id] = ticker
  })
}

export const tickerIdentitySlice = createSlice({
  name: 'tickerIdentity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeIdentityBases)
  },
})

export default tickerIdentitySlice.reducer
