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

const storeFromSystemCombos = (
  state: TraderComboState,
  action: PayloadAction<interfaces.response.ComboProfile[]>,
) => {
  action.payload.forEach((comboProfile) => {
    state.base[comboProfile.identity.id] = comboProfile.identity
    state.detail[comboProfile.identity.id] = comboProfile.detail
  })
}

const _updateForTest = (
  state: any,
  action: any,
) => {
  Object.keys(action.payload).forEach((key) => {
    state[key] = action.payload[key]
  })
}

export const traderComboSlice = createSlice({
  name: 'traderCombo',
  initialState,
  reducers: {
    _updateForTest,
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, storeFromComboDetail)
    builder.addCase(actions.fetchSystemTraderCombos.fulfilled, storeFromSystemCombos)
  },
})

export default traderComboSlice.reducer
