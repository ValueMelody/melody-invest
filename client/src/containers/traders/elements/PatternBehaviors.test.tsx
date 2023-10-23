import * as interfaces from '@shared/interfaces'
import * as routerTool from 'tools/router'
import { fireEvent, render, screen } from 'test.utils'
import { createMemoryHistory } from 'history'
import { mock } from 'ts-mockito'
import PatternBehaviors from './PatternBehaviors'

describe('#PatternBehaviors', () => {
  const history = createMemoryHistory({ initialEntries: ['/test'] })

  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const pattern = {
    ...patternMock,
    priceDailyIncreaseBuy: 1,
    priceDailyIncreaseSell: 2,
    priceDailyDecreaseBuy: 3,
    priceDailyDecreaseSell: 4,
  }

  test('could render', () => {
    render(
      <PatternBehaviors
        envId={12}
        pattern={pattern}
      />,
      { history },
    )

    const labels = screen.getAllByTestId('behaviorLabel')
    expect(labels.length).toBe(9 + 4)

    fireEvent.click(labels[0])
    expect(history.location.pathname).toBe(routerTool.behaviorDetailRoute(12, 'priceDailyIncreaseBuy'))

    fireEvent.click(labels[1])
    expect(history.location.pathname).toBe(routerTool.behaviorDetailRoute(12, 'priceDailyDecreaseBuy'))
  })
})
