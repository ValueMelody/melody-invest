import * as interfaces from '@shared/interfaces'
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
    }
  }),
}

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
})
