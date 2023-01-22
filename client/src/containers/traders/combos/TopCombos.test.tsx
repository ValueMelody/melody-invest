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
const combo = { ...instance(comboType), id: -1, isSystem: true, name: 'default combo', traderIds: [] }
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

    await act(() => {
      render(<TopCombos />)
    })

    expect(screen.getByTestId('traderComboCardName')?.innerHTML).toContain('default combo')
  })
})
