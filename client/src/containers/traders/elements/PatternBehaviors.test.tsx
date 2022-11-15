import * as interfaces from '@shared/interfaces'
import { createMemoryHistory } from 'history'
import PatternBehaviors from './PatternBehaviors'
import { fireEvent, render, screen } from 'test.utils'
import { mock, instance, when } from 'ts-mockito'
import * as routerTool from 'tools/router'

describe('#PatternBehaviors', () => {
  const history = createMemoryHistory({ initialEntries: ['/test'] })

  const patternMock: interfaces.traderPatternModel.Public = mock({})
  when(patternMock.priceDailyIncreaseBuy).thenReturn(1)
  when(patternMock.priceDailyIncreaseSell).thenReturn(2)
  when(patternMock.priceDailyDecreaseBuy).thenReturn(3)
  when(patternMock.priceDailyDecreaseSell).thenReturn(4)
  const pattern = instance(patternMock)

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
