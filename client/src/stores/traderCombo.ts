import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest, _updateForTest } from 'tools/store'

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
  action: PayloadAction<{ detail: interfaces.response.ComboDetail; id: number }>,
) => {
  state.detail[action.payload.id] = action.payload.detail
}

const storeFromComboBase = (
  state: TraderComboState,
  action: PayloadAction<interfaces.traderComboModel.Identity>,
) => {
  state.base[action.payload.id] = action.payload
}

const removeUserFollowed = (state: TraderComboState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    delete state.base[numKey]
    delete state.detail[numKey]
  })
}

const removeById = (state: TraderComboState, action: PayloadAction<number>) => {
  delete state.base[action.payload]
  delete state.detail[action.payload]
}

export const traderComboSlice = createSlice({
  name: 'traderCombo',
  initialState,
  reducers: {
    _updateForTest,
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.fetchTraderComboDetail.fulfilled, storeFromComboDetail)
    builder.addCase(actions.createTraderCombo.fulfilled, storeFromComboBase)
    builder.addCase(actions.deleteTraderCombo.fulfilled, removeById)
    builder.addCase(actions.logout, removeUserFollowed)
    builder.addCase(actions.lockUserAccount.fulfilled, removeUserFollowed)
  },
})

export default traderComboSlice.reducer
