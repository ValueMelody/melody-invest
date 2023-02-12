import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { instance, mock } from 'ts-mockito'
import { render, screen } from 'test.utils'
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
      { ...instance(tickerType), id: 1, symbol: 'AAA', tickerCategoryId: 2 },
      { ...instance(tickerType), id: 2, symbol: 'BBB', tickerCategoryId: 1 },
      { ...instance(tickerType), id: 3, symbol: 'CCC', tickerCategoryId: 1 },
    ]
  })

describe('#TickerList', () => {
  test('could render tickers', () => {
    render(<TickerList />)
    expect(screen.queryByText('AAA')).toBeInTheDocument()
    expect(screen.queryByText('BBB')).toBeInTheDocument()
    expect(screen.queryByText('CCC')).toBeInTheDocument()
  })
})
