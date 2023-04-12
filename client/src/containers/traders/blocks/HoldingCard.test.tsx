import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import HoldingCard from './HoldingCard'

const holdingType = mock<interfaces.traderHoldingModel.Detail>({})
const itemType = mock<interfaces.traderHoldingModel.Item>({})
const holding = {
  ...instance(holdingType),
  items: new Array(30).fill(null).map((_, index) => {
    return {
      ...instance(itemType),
      tickerId: index,
      value: 0,
      symbol: String(index),
    }
  }),
}

jest.mock('selectors', () => {
  const actual = jest.requireActual('selectors')
  return {
    __esModule: true,
    ...actual,
  }
})

describe('#HoldingCard', () => {
  test('show holdings accordingly', () => {
    render(
      <HoldingCard
        holding={holding}
        previousHolding={null}
        initialValue={100}
      />,
    )
    expect(screen.getAllByTestId('holdingShare').length).toBe(10)

    fireEvent.click(screen.getByTestId('showAllBtn'))
    expect(screen.getAllByTestId('holdingShare').length).toBe(30)
  })

  test('could ordering holdings', () => {
    holding.items[0].value = 1
    holding.items[1].value = 3
    holding.items[2].value = 2
    holding.items[3].value = 4

    const tickerType = mock<interfaces.tickerModel.Record>({})

    jest.spyOn(selectors, 'selectTickerIdentityBaseDict')
      .mockImplementation(() => () => ({
        0: {
          ...instance(tickerType),
          symbol: 'A',
        },
        1: {
          ...instance(tickerType),
          symbol: 'B',
        },
        2: {
          ...instance(tickerType),
          symbol: 'C',
        },
        3: {
          ...instance(tickerType),
          symbol: 'D',
        },
      }))

    render(
      <HoldingCard
        holding={holding}
        previousHolding={null}
        initialValue={100}
      />,
    )
    expect(screen.getAllByTestId('holdingShare').length).toBe(10)

    expect(screen.getAllByTestId('holdingshareTitle')[0]?.innerHTML).toContain('D')
    expect(screen.getAllByTestId('holdingshareTitle')[1]?.innerHTML).toContain('B')
    expect(screen.getAllByTestId('holdingshareTitle')[2]?.innerHTML).toContain('C')
    expect(screen.getAllByTestId('holdingshareTitle')[3]?.innerHTML).toContain('A')
  })
})
