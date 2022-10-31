import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'

export interface TraderComboBase {
  [comboId: number]: interfaces.traderComboModel.Identity;
}

export interface TraderComboDetail {
  [comboId: number]: interfaces.response.ComboDetail;
}

export interface TraderComboState {
  base: TraderComboBase;
  detail: TraderComboDetail;
}

const initialState: TraderComboState = {
  base: {},
  detail: {},
}

const storeFromUserOverall = (
  state: TraderComboState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  action.payload.traderCombos.forEach((combo) => {
    state.base[combo.id] = combo
  })
}

const storeFromComboDetail = (
  state: TraderComboState,
  action: PayloadAction<{ detail: interfaces.response.ComboDetail; id: number; }>,
) => {
  state.detail[action.payload.id] = action.payload.detail
}

export const traderComboSlice = createSlice({
  name: 'traderCombo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, storeFromComboDetail)
  },
})

export default traderComboSlice.reducer
