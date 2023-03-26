import { render, screen } from 'test.utils'
import Maintain from './Maintain'

describe('#Maintain', () => {
  test('could render message', () => {
    render(<Maintain />)
    expect(screen.queryByTestId('maintainText')?.innerHTML).toContain('Sorry')
  })
})
