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

const addTraderById = (state: UserState, action: PayloadAction<number>) => {
  if (state.userTraderIds.includes(action.payload)) return
  state.userTraderIds = [...state.userTraderIds, action.payload]
}

const addTraderFromProfile = (state: UserState, action: PayloadAction<interfaces.response.TraderProfile>) => {
  if (state.userTraderIds.includes(action.payload.trader.id)) return
  state.userTraderIds = [...state.userTraderIds, action.payload.trader.id]
}

const removeTraderById = (state: UserState, action: PayloadAction<number>) => {
  state.userTraderIds = state.userTraderIds.filter((id) => id !== action.payload)
}

const logout = (state: UserState) => {
  state.hasLogin = false
  state.userEmail = ''
  state.userType = constants.User.Type.Guest
  state.userTraderIds = []
  state.planStartAtUTC = null
  state.planEndAtUTC = null

  requestAdapter.setAuthToken('')
  storageAdapter.remove(commonEnum.StorageKey.AuthToken)
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
    builder.addCase(actions.createWatchedProfile.fulfilled, addTraderById)
    builder.addCase(actions.createTraderProfile.fulfilled, addTraderFromProfile)
    builder.addCase(actions.deleteWatchedProfile.fulfilled, removeTraderById)
    builder.addCase(actions.lockUserAccount.fulfilled, logout)
    builder.addCase(actions.logout, logout)
  },
})

export default userSlice.reducer
