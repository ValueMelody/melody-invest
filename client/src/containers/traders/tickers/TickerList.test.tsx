import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { instance, mock } from 'ts-mockito'
import { fireEvent, render, screen } from 'test.utils'
import TickerList from './TickerList'

const tickerType = mock<interfaces.tickerModel.Identity>({})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.spyOn(selectors, 'selectTickerIdentityBases')
  .mockImplementation(() => () => {
    return [
      { ...instance(tickerType), id: 1, symbol: 'AAA', name: 'aaa', tickerCategoryId: 2 },
      { ...instance(tickerType), id: 2, symbol: 'BBB', name: 'bbb', tickerCategoryId: 1 },
      { ...instance(tickerType), id: 3, symbol: 'CCC', name: 'test', tickerCategoryId: 1 },
    ]
  })

jest.spyOn(selectors, 'selectTickerCategoryBases')
  .mockImplementation(() => () => {
    return [
      { id: 1, name: 'cat1' },
      { id: 2, name: 'cat2' },
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

    const cat0 = screen.getByTestId('variant0')
    const cat1 = screen.getByTestId('variant1')
    const cat2 = screen.getByTestId('variant2')
    fireEvent.click(cat1)
    expect(screen.queryByText('AAA')).not.toBeInTheDocument()
    expect(screen.queryByText('BBB')).toBeInTheDocument()
    expect(screen.queryByText('CCC')).toBeInTheDocument()

    fireEvent.click(cat2)
    expect(screen.queryByText('AAA')).toBeInTheDocument()
    expect(screen.queryByText('BBB')).not.toBeInTheDocument()
    expect(screen.queryByText('CCC')).not.toBeInTheDocument()

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'b' } })
    expect(screen.queryByText('AAA')).not.toBeInTheDocument()

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'a' } })
    expect(screen.queryByText('AAA')).toBeInTheDocument()

    fireEvent.click(cat0)
    fireEvent.change(screen.getByTestId('search'), { target: { value: 't' } })
    expect(screen.queryByText('AAA')).not.toBeInTheDocument()
    expect(screen.queryByText('BBB')).not.toBeInTheDocument()
    expect(screen.queryByText('CCC')).toBeInTheDocument()

    fireEvent.click(screen.getByText('CCC'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/tickers/3/envs/1')
  })
})
