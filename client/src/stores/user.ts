import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as actions from 'actions'
import * as storageAdapter from 'adapters/storage'
import * as commonEnum from 'enums/common'

const authToken = storageAdapter.get(commonEnum.StorageKey.AuthToken)

interface UserAccess {
  canFollowEnv: boolean;
  canFollowCombo: boolean;
  canFollowTrader: boolean;
  accessibleEnvIds: number[];
  accessibleComboIds: number[];
  accessibleTraderIds: number[];
}

export interface UserState {
  hasLogin: boolean;
  userTraderIds: number[];
  userType: number;
  userEmail: string,
  planStartAtUTC: string | null;
  planEndAtUTC: string | null;
  access: UserAccess;
}

const initialState: UserState = {
  hasLogin: !!authToken,
  userEmail: '',
  userTraderIds: [],
  userType: constants.User.Type.Guest,
  planStartAtUTC: null,
  planEndAtUTC: null,
  access: {
    canFollowEnv: false,
    canFollowCombo: false,
    canFollowTrader: false,
    accessibleEnvIds: [],
    accessibleComboIds: [],
    accessibleTraderIds: [],
  },
}

const storeFromUserOverall = (
  state: UserState,
  action: PayloadAction<interfaces.response.UserOverall>,
) => {
  state.userEmail = action.payload.email
  state.userType = action.payload.type
  state.planStartAtUTC = action.payload.planStartAtUTC
  state.planEndAtUTC = action.payload.planEndAtUTC
  state.userTraderIds = action.payload.traderProfiles.map((profile) => profile.trader.id)
}

const updateUserLoginState = (
  state: UserState,
  action: PayloadAction<boolean>,
) => {
  state.hasLogin = action.payload
}

const _updateForTest = (
  state: any,
  action: any,
) => {
  Object.keys(action.payload).forEach((key) => {
    state[key] = action.payload[key]
  })
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserLoginState,
    _updateForTest,
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
  },
})

export default userSlice.reducer
