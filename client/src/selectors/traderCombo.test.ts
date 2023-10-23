import * as interfaces from '@shared/interfaces'
import { instance, mock, when } from 'ts-mockito'
import * as traderCombo from './traderCombo'

const type = mock<AppState>({})

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo1 = instance(comboType)
const combo2 = instance(comboType)
const combo3 = instance(comboType)

const detail = mock<interfaces.response.ComboDetail>({})
const detail1 = instance(detail)
const detail2 = instance(detail)
const detail3 = instance(detail)

const combo = {
  base: {
    1: combo1,
    2: combo2,
    3: combo3,
  },
  detail: {
    1: detail1,
    2: detail2,
    3: detail3,
  },
}

when(type.traderCombo).thenReturn(combo)
const stateInstance = instance(type)

describe('#selectTraderComboBases', () => {
  test('could select trader combo bases', () => {
    expect(traderCombo.selectTraderComboBases()(stateInstance)).toStrictEqual([
      combo1, combo2, combo3,
    ])
  })
})

describe('#selectTraderComboBaseById', () => {
  test('could select trader combo base by id', () => {
    expect(traderCombo.selectTraderComboBaseById(1)(stateInstance)).toStrictEqual(combo1)
    expect(traderCombo.selectTraderComboBaseById(3)(stateInstance)).toStrictEqual(combo3)
    expect(traderCombo.selectTraderComboBaseById(undefined)(stateInstance)).toStrictEqual(undefined)
  })
})

describe('#selectTraderComboDetailById', () => {
  test('could select trader combo detail by id', () => {
    expect(traderCombo.selectTraderComboDetailById(1)(stateInstance)).toStrictEqual(detail1)
    expect(traderCombo.selectTraderComboDetailById(3)(stateInstance)).toStrictEqual(detail3)
    expect(traderCombo.selectTraderComboDetailById(undefined)(stateInstance)).toStrictEqual(undefined)
  })
})
