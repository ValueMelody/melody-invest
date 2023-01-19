import * as constants from '@shared/constants'
import * as parseTool from 'tools/parse'
import { render, screen } from 'test.utils'
import BehaviorList from './BehaviorList'

describe('#BehaviorList', () => {
  test('could render behaviors', () => {
    const buyBehaviors = constants.Behavior.BuyBehaviors
    render(<BehaviorList />)
    buyBehaviors.forEach((behavior) => {
      expect(screen.queryByText(parseTool.behaviorTitle(behavior))).toBeInTheDocument()
    })
  })
})
