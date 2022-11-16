import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import { instance, mock, when } from 'ts-mockito'
import { render, screen } from 'test.utils'
import HoldingShare from './HoldingShare'

describe('#HoldingShare', () => {
  const tickerIdentity = {
    id: 12,
    symbol: 'AAPL',
    region: 'US',
    name: 'Apple',
    tickerCategoryId: 3,
  }
  const holdingItem = {
    tickerId: 12,
    shares: 100,
    splitMultiplier: 2,
    value: 2000,
  }

  test('could render', () => {
    render(
      <HoldingShare
        holdingItem={holdingItem}
        previousDetail={null}
        totalValue={10000}
        tickerIdentity={tickerIdentity}
      />,
    )
    const container = screen.getByTestId('holdingShare')
    expect(container.innerHTML).toContain(tickerIdentity.symbol)
    expect(container.innerHTML).toContain('20.00%')

    const newText = localeTool.t('common.new')
    expect(screen.queryByText(newText)).toBeFalsy()
  })

  test('could render without tickerIdentity', () => {
    render(
      <HoldingShare
        holdingItem={holdingItem}
        previousDetail={null}
        totalValue={10000}
        tickerIdentity={null}
      />,
    )
    const container = screen.getByTestId('holdingShare')
    expect(container.innerHTML).not.toContain(tickerIdentity.symbol)
    expect(container.innerHTML).toContain('20.00%')
  })

  test('could render new label', () => {
    const detailMock: interfaces.traderHoldingModel.Detail = mock({})
    when(detailMock.items).thenReturn([])
    const previousDetail = instance(detailMock)
    render(
      <HoldingShare
        holdingItem={holdingItem}
        previousDetail={previousDetail}
        totalValue={10000}
        tickerIdentity={tickerIdentity}
      />,
    )
    const newText = localeTool.t('common.new')
    expect(screen.queryByText(newText)).toBeTruthy()
  })

  test('could render positive differ', () => {
    const detailMock: interfaces.traderHoldingModel.Detail = mock({})
    when(detailMock.items).thenReturn([{
      tickerId: 12,
      shares: 150,
      splitMultiplier: 1,
      value: 1500,
    }])
    const previousDetail = instance(detailMock)
    render(
      <HoldingShare
        holdingItem={holdingItem}
        previousDetail={previousDetail}
        totalValue={10000}
        tickerIdentity={tickerIdentity}
      />,
    )
    const container = screen.getByTestId('holdingShare')
    const differ = container.querySelector('span')
    expect(differ?.className).toContain('text-green-600')
    expect(differ?.innerHTML).toContain('+ 50')

    const newText = localeTool.t('common.new')
    expect(screen.queryByText(newText)).toBeFalsy()
  })

  test('could render negative differ', () => {
    const detailMock: interfaces.traderHoldingModel.Detail = mock({})
    when(detailMock.items).thenReturn([{
      tickerId: 12,
      shares: 100,
      splitMultiplier: 3,
      value: 3000,
    }])
    const previousDetail = instance(detailMock)
    render(
      <HoldingShare
        holdingItem={holdingItem}
        previousDetail={previousDetail}
        totalValue={10000}
        tickerIdentity={tickerIdentity}
      />,
    )
    const container = screen.getByTestId('holdingShare')
    const differ = container.querySelector('span')
    expect(differ?.className).toContain('text-red-600')
    expect(differ?.innerHTML).toContain('- 100')

    const newText = localeTool.t('common.new')
    expect(screen.queryByText(newText)).toBeFalsy()
  })
})
