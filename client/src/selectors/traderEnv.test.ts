import * as interfaces from '@shared/interfaces'
import * as traderEnv from './traderEnv'
import { instance, mock, when } from 'ts-mockito'

const type = mock<AppState>({})

const envType = mock<interfaces.traderEnvModel.Identity>({})
const env1 = instance(envType)
const env2 = instance(envType)
const env3 = instance(envType)

const topTraderProfiles = mock<TopTraderProfileIds>({})
const detail1 = {
  topProfiles: instance(topTraderProfiles),
}
const detail2 = {
  topProfiles: instance(topTraderProfiles),
}
const detail3 = {
  topProfiles: instance(topTraderProfiles),
}

const env = {
  base: {
    1: env1,
    2: env2,
    3: env3,
  },
  detail: {
    1: detail1,
    2: detail2,
    3: detail3,
  },
}

when(type.traderEnv).thenReturn(env)
const stateInstance = instance(type)

describe('#selectTraderEnvBaseDict', () => {
  test('could select trader env base dict', () => {
    expect(traderEnv.selectTraderEnvBaseDict()(stateInstance)).toStrictEqual(env.base)
  })
})

describe('#selectTraderEnvBases', () => {
  test('could select trader env bases', () => {
    expect(traderEnv.selectTraderEnvBases()(stateInstance)).toStrictEqual([
      env1, env2, env3,
    ])
  })
})

describe('#selectTraderEnvBaseById', () => {
  test('could select trader env base by id', () => {
    expect(traderEnv.selectTraderEnvBaseById(1)(stateInstance)).toStrictEqual(env1)
    expect(traderEnv.selectTraderEnvBaseById(3)(stateInstance)).toStrictEqual(env3)
    expect(traderEnv.selectTraderEnvBaseById(undefined)(stateInstance)).toStrictEqual(undefined)
  })
})

describe('#selectTraderEnvDetailById', () => {
  test('could select trader env detail by id', () => {
    expect(traderEnv.selectTraderEnvDetailById(1)(stateInstance)).toStrictEqual(detail1)
    expect(traderEnv.selectTraderEnvDetailById(3)(stateInstance)).toStrictEqual(detail3)
    expect(traderEnv.selectTraderEnvDetailById(undefined)(stateInstance)).toStrictEqual(undefined)
  })
})
