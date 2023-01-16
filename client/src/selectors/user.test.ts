import * as interfaces from '@shared/interfaces'
import * as userSelector from './user'
import { instance, mock, when } from 'ts-mockito'
import { UserState } from 'stores/user'

const type = mock<AppState>({})
const userType = mock<UserState>({})

const user = {
  ...instance(userType),
  userType: 0,
  userTraderIds: [],
}
when(type.user).thenReturn(user)

const envType = mock<interfaces.traderEnvModel.Record>({})
const env1 = {
  ...instance(envType),
  id: 1,
}
const env2 = {
  ...instance(envType),
  id: 2,
}
const env3 = {
  ...instance(envType),
  id: 3,
}
const env = {
  base: {
    1: env1,
    2: env2,
    3: env3,
  },
  detail: {},
}
when(type.traderEnv).thenReturn(env)

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo1 = {
  ...instance(comboType),
  id: 1,
}
const combo2 = {
  ...instance(comboType),
  id: 2,
}
const combo3 = {
  ...instance(comboType),
  id: 3,
}
const combo = {
  base: {
    1: combo1,
    2: combo2,
    3: combo3,
  },
  detail: {},
}
when(type.traderCombo).thenReturn(combo)

const stateInstance = instance(type)

describe('#selectUser', () => {
  test('could select for guest', () => {
    expect(userSelector.selectUser()(stateInstance)).toStrictEqual({
      ...user,
      access: {
        canFollowEnv: false,
        canFollowCombo: false,
        canFollowTrader: false,
        accessibleEnvIds: [],
        accessibleComboIds: [],
        accessibleTraderIds: [],
      },
    })
  })

  test('could select for basic user', () => {
    const user = {
      ...instance(userType),
      userType: 1,
      userTraderIds: [1, 2],
    }
    when(type.user).thenReturn(user)
    const stateInstance = instance(type)
    expect(userSelector.selectUser()(stateInstance)).toStrictEqual({
      ...user,
      access: {
        canFollowEnv: false,
        canFollowCombo: false,
        canFollowTrader: true,
        accessibleEnvIds: [],
        accessibleComboIds: [],
        accessibleTraderIds: [1, 2],
      },
    })
  })

  test('could select for pro user', () => {
    const user = {
      ...instance(userType),
      userType: 2,
      userTraderIds: [1, 2],
    }
    when(type.user).thenReturn(user)
    const stateInstance = instance(type)
    expect(userSelector.selectUser()(stateInstance)).toStrictEqual({
      ...user,
      access: {
        canFollowEnv: false,
        canFollowCombo: false,
        canFollowTrader: true,
        accessibleEnvIds: [1, 2, 3],
        accessibleComboIds: [1, 2, 3],
        accessibleTraderIds: [1, 2],
      },
    })
  })

  test('could select for premium user', () => {
    const user = {
      ...instance(userType),
      userType: 3,
      userTraderIds: [1, 2, 3],
    }
    when(type.user).thenReturn(user)
    const stateInstance = instance(type)
    expect(userSelector.selectUser()(stateInstance)).toStrictEqual({
      ...user,
      access: {
        canFollowEnv: true,
        canFollowCombo: true,
        canFollowTrader: true,
        accessibleEnvIds: [1, 2, 3],
        accessibleComboIds: [1, 2, 3],
        accessibleTraderIds: [1, 2, 3],
      },
    })
  })
})
