import { render, screen } from 'test.utils'
import Setting from './Setting'

describe('#Setting', () => {
  test('could render buttons', () => {
    render(<Setting />)

    expect(screen.queryByTestId('signOutBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('lockAccessBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('changePasswordBtn')).toBeInTheDocument()
  })
})
