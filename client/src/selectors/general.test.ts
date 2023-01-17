import * as general from './general'
import * as interfaces from '@shared/interfaces'
import { instance, mock, when } from 'ts-mockito'
import { GlobalState } from 'stores/global'

const type = mock<AppState>({})
const policyType = mock<interfaces.policyModel.Record>({})
const policyInstance = instance(policyType)
const content = {
  privacyPolicy: policyInstance,
  termsPolicy: policyInstance,
  activeTraderChartIndex: 0,
}
when(type.content).thenReturn(content)
const stateInstance = instance(type)

const globalType = mock<GlobalState>({})
const globalInstance = instance(globalType)
when(type.global).thenReturn(globalInstance)

describe('#selectContent', () => {
  test('could select content', () => {
    expect(general.selectContent()(stateInstance)).toStrictEqual(content)
  })
})

describe('#selectGlobal', () => {
  test('could select global', () => {
    expect(general.selectGlobal()(stateInstance)).toStrictEqual(globalInstance)
  })
})
