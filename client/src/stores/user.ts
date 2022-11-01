import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as actions from 'actions'
import * as storageAdapter from 'adapters/storage'
import * as requestAdapter from 'adapters/request'
import * as commonEnum from 'enums/common'
import { _updateForTest, _resetForTest } from 'tools/store'

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

const storeFromCreateUserToken = (
  state: UserState,
  action: PayloadAction<interfaces.response.UserToken>,
) => {
  const { jwtToken } = action.payload
  requestAdapter.setAuthToken(jwtToken)
  storageAdapter.set(commonEnum.StorageKey.AuthToken, jwtToken)
  state.hasLogin = true
}

const reset = (state: UserState) => {
  state.hasLogin = false
  state.userEmail = ''
  state.userType = constants.User.Type.Guest
  state.userTraderIds = []
  state.planStartAtUTC = null
  state.planEndAtUTC = null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserLoginState,
    _updateForTest,
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.createUserToken.fulfilled, storeFromCreateUserToken)
    builder.addCase(actions.logout, reset)
  },
})

export default userSlice.reducer
