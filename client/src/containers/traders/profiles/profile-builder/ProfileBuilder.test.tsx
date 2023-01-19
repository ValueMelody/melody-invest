import { render, screen } from 'test.utils'
import ProfileBuilder from './ProfileBuilder'

describe('#ProfileBuilder', () => {
  test('disable create button by default', () => {
    render(<ProfileBuilder />)
    expect(screen.getByTestId('createBtn')).toBeDisabled()
  })
})
