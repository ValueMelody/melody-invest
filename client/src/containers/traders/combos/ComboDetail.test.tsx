import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ComboDetail from './ComboDetail'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => (
      {
        comboId: '1',
      }
    ),
  }
})

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo = { ...instance(comboType), id: 1, name: 'test combo', traderIds: [] }
const comboDetail = mock<interfaces.response.ComboDetail>({})
const detail = { ...instance(comboDetail), holdings: [] }

describe('#ComboDetail', () => {
  test('could show combo info', async () => {
    jest.spyOn(selectors, 'selectTraderComboBaseById')
      .mockImplementation(() => () => {
        return combo
      })
    jest.spyOn(selectors, 'selectTraderComboDetailById')
      .mockImplementation(() => () => {
        return detail
      })
    jest.spyOn(selectors, 'selectTraderEnvBaseDict')
      .mockImplementation(() => () => {
        return []
      })
    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => {
        return []
      })

    await act(() => {
      render(<ComboDetail />)
    })

    expect(screen.queryByTestId('traderComboCardName')?.innerHTML).toContain('test combo')
  })
})
