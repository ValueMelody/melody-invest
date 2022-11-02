import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { _updateForTest, _resetForTest } from 'tools/store'

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

const removeUserFollowed = (state: TraderComboState) => {
  Object.keys(state.base).forEach((key: string) => {
    const numKey = Number(key)
    const value = state.base[numKey]
    if (!value.isSystem) {
      delete state.base[numKey]
      delete state.detail[numKey]
    }
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
    builder.addCase(actions.fetchSystemTraderCombos.fulfilled, storeFromSystemCombos)
    builder.addCase(actions.deleteTraderCombo.fulfilled, removeById)
    builder.addCase(actions.logout, removeUserFollowed)
  },
})

export default traderComboSlice.reducer
