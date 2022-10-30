import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'

export interface TraderEnvState {
  [envId: number]: interfaces.traderEnvModel.Record;
}

const initialState: TraderEnvState = {}

const storeEnvs = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.traderEnvs.forEach((env) => {
    state[env.id] = env
  })
}

export const traderEnvSlice = createSlice({
  name: 'traderEnv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeEnvs)
  },
})

export default traderEnvSlice.reducer
