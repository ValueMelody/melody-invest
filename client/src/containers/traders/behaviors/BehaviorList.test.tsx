import * as constants from '@shared/constants'
import * as parseTool from 'tools/parse'
import { fireEvent, render, screen } from 'test.utils'
import BehaviorList from './BehaviorList'

const navigate = jest.fn()
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => navigate,
  }
})

describe('#BehaviorList', () => {
  test('could render behaviors', () => {
    const buyBehaviors = constants.Behavior.BuyBehaviors
    render(<BehaviorList />)
    buyBehaviors.forEach((behavior) => {
      expect(screen.queryByText(parseTool.behaviorTitle(behavior))).toBeInTheDocument()
    })

    const label = screen.getByText(parseTool.behaviorTitle('priceWeeklyDecreaseBuy'))
    fireEvent.click(label)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/behaviors/priceWeeklyDecreaseBuy/envs/1')

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'Daily' } })
    buyBehaviors.forEach((behavior) => {
      const title = parseTool.behaviorTitle(behavior)
      if (behavior.includes('Daily')) expect(screen.queryByText(title)).toBeInTheDocument()
      if (!behavior.includes('Daily')) expect(screen.queryByText(title)).not.toBeInTheDocument()
    })

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'US Annual' } })
    buyBehaviors.forEach((behavior) => {
      const title = parseTool.behaviorTitle(behavior)
      if (title.includes('US Annual')) expect(screen.queryByText(title)).toBeInTheDocument()
      if (!title.includes('US Annual')) expect(screen.queryByText(title)).not.toBeInTheDocument()
    })

    fireEvent.change(screen.getByTestId('search'), { target: { value: 'maximum' } })
    buyBehaviors.forEach((behavior) => {
      const desc = parseTool.behaviorDesc(behavior)
      if (desc.includes('Maximum')) expect(screen.queryByText(desc)).toBeInTheDocument()
      if (!desc.includes('Maximum')) expect(screen.queryByText(desc)).not.toBeInTheDocument()
    })
  })

  test('could switch behaviors', () => {
    render(<BehaviorList />)

    fireEvent.click(screen.getByTestId('variantsellBehaviors'))
    constants.Behavior.SellBehaviors.forEach((behavior) => {
      expect(screen.queryByText(parseTool.behaviorTitle(behavior))).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('variantbuyBehaviors'))
    constants.Behavior.BuyBehaviors.forEach((behavior) => {
      expect(screen.queryByText(parseTool.behaviorTitle(behavior))).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('variantotherBehaviors'))
    const otherBehaviors = [
      ...constants.Behavior.PreferenceBehaviors,
      ...constants.Behavior.AllocateBehaviors,
      ...constants.Behavior.FrequencyBehaviors,
    ]
    otherBehaviors.forEach((behavior) => {
      expect(screen.queryByText(parseTool.behaviorTitle(behavior))).toBeInTheDocument()
    })
  })
})
