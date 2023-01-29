import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TopCombos from './TopCombos'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo = {
  ...instance(comboType),
  id: -1,
  isSystem: true,
  name: 'default combo',
  traderIds: [1, 2, 3],
}
const comboDetail = mock<interfaces.response.ComboDetail>({})
const detail = { ...instance(comboDetail), holdings: [] }

describe('#TopCombos', () => {
  test('could render combo', async () => {
    jest.spyOn(selectors, 'selectTraderComboBases')
      .mockImplementation(() => () => {
        return [combo]
      })
    jest.spyOn(selectors, 'selectTraderComboDetailById')
      .mockImplementation(() => () => {
        return detail
      })

    const traderType = mock<interfaces.traderModel.Record>({})
    const patternType = mock<interfaces.traderPatternModel.Public>({})
    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => {
        return {
          1: {
            trader: {
              ...instance(traderType),
              traderPatternId: 1,
              traderEnvId: 1,
              id: 1,
            },
            pattern: instance(patternType),
          },
          2: {
            trader: {
              ...instance(traderType),
              traderPatternId: 2,
              traderEnvId: 1,
              id: 2,
            },
            pattern: instance(patternType),
          },
          3: {
            trader: {
              ...instance(traderType),
              traderPatternId: 2,
              traderEnvId: 1,
              id: 3,
            },
            pattern: instance(patternType),
          },
        }
      })

    const envType = mock<interfaces.traderEnvModel.Record>({})
    jest.spyOn(selectors, 'selectTraderEnvBaseDict')
      .mockImplementation(() => () => {
        return {
          1: instance(envType),
        }
      })

    await act(() => {
      render(<TopCombos />)
    })

    expect(screen.getByTestId('traderComboCardName')?.innerHTML).toContain('default combo')
    expect(screen.getAllByTestId('profileValue').length).toBe(3)
  })
})
