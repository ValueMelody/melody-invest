import { render, screen } from 'test.utils'
import ComboBuilder from './ComboBuilder'

describe('#ComboBuilder', () => {
  test('disable create button by default', () => {
    render(<ComboBuilder />)
    expect(screen.getByTestId('createBtn')).toBeDisabled()
  })
})
