import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { _resetForTest, _updateForTest } from 'tools/store'

interface UserAccess {
  canFollowEnv: boolean;
  canFollowCombo: boolean;
  canFollowTrader: boolean;
  accessibleEnvIds: number[];
  accessibleComboIds: number[];
  accessibleTraderIds: number[];
}

export interface UserState {
  userTraderIds: number[];
  userType: number;
  userEmail: string,
  planStartAtUTC: string | null;
  planEndAtUTC: string | null;
  access: UserAccess;
}

const initialState: UserState = {
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

const onCreateSubscriptionSuccess = (
  state: UserState,
  action: PayloadAction<{
    userToken: interfaces.response.UserToken;
    planType: number;
  }>,
) => {
  state.userType = action.payload.planType
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
    _updateForTest,
    _resetForTest: (state) => _resetForTest(state, initialState),
  },
  extraReducers: (builder) => {
    builder.addCase(actions.lockUserAccount.fulfilled, logout)
    builder.addCase(actions.logout, logout)
    builder.addCase(actions.fetchUserOverall.fulfilled, storeFromUserOverall)
    builder.addCase(actions.createWatchedProfile.fulfilled, addTraderById)
    builder.addCase(actions.createTraderProfile.fulfilled, addTraderFromProfile)
    builder.addCase(actions.deleteWatchedProfile.fulfilled, removeTraderById)
    builder.addCase(actions.createUserSubscription.fulfilled, onCreateSubscriptionSuccess)
  },
})

export default userSlice.reducer
