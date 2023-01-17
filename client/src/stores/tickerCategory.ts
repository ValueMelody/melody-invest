import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest } from 'tools/store'

interface TickerCategoryBase {
  [categoryId: number]: interfaces.tickerCategoryModel.Record;
}

export interface TickerCategoryState {
  base: TickerCategoryBase;
}

const initialState: TickerCategoryState = {
  base: {},
}

const storeCategoryBases = (
  state: TickerCategoryState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.tickerCategories.forEach((category) => {
    state.base[category.id] = category
  })
}

export const tickerCategorySlice = createSlice({
  name: 'tickerCategory',
  initialState,
  reducers: {
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeCategoryBases)
  },
})

export default tickerCategorySlice.reducer
