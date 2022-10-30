import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'

interface TraderEnvBase {
  [envId: number]: interfaces.traderEnvModel.Record;
}

export interface TraderEnvState {
  base: TraderEnvBase;
}

const initialState: TraderEnvState = {
  base: {},
}

const storeEnvBases = (
  state: TraderEnvState,
  action: PayloadAction<interfaces.response.SystemDefaults>,
) => {
  action.payload.traderEnvs.forEach((env) => {
    state.base[env.id] = env
  })
}

export const traderEnvSlice = createSlice({
  name: 'traderEnv',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actions.fetchSystemDefaults.fulfilled, storeEnvBases)
  },
})

export default traderEnvSlice.reducer
