import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import { GlobalState } from 'stores/global'
import TickerList from './TickerList'

const tickerType = mock<interfaces.tickerModel.Record>({})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const globalState = mock<GlobalState>({})
jest.spyOn(selectors, 'selectGlobal')
  .mockImplementation(() => () => ({
    ...instance(globalState),
    refreshToken: '123',
  }))

jest.spyOn(selectors, 'selectTickerIdentityBases')
  .mockImplementation(() => () => {
    return [
      { ...instance(tickerType), id: 1, symbol: 'AAA', name: 'aaa' },
      { ...instance(tickerType), id: 2, symbol: 'BBB', name: 'bbb' },
      { ...instance(tickerType), id: 3, symbol: 'CCC', name: 'test' },
    ]
  })

const navigate = jest.fn()
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => navigate,
  }
})

describe('#TickerList', () => {
  test('could render tickers', () => {
    render(<TickerList />)
    expect(screen.queryByText('AAA')).toBeInTheDocument()
    expect(screen.queryByText('BBB')).toBeInTheDocument()
    expect(screen.queryByText('CCC')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'b' } })
    expect(screen.queryByText('AAA')).not.toBeInTheDocument()

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'a' } })
    expect(screen.queryByText('AAA')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('search'), { target: { value: '' } })
    fireEvent.click(screen.getByText('CCC'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/tickers/3/envs/1')
  })
})
