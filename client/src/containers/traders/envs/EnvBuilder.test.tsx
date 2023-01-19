import { render, screen } from 'test.utils'
import EnvBuilder from './EnvBuilder'

jest.mock('react-select', () => '')

describe('#EnvBuilder', () => {
  test('disable create by default', () => {
    render(<EnvBuilder />)
    expect(screen.getByTestId('createButton')).toBeDisabled()
  })
})
