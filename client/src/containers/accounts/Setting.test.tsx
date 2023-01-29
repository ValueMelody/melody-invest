import { fireEvent, render, screen, waitFor } from 'test.utils'
import Setting from './Setting'
import axios from 'axios'

describe('#Setting', () => {
  test('could render buttons', async () => {
    const put = jest.fn()
    jest.spyOn(axios, 'put').mockImplementation(put)

    render(<Setting />)

    expect(screen.queryByTestId('signOutBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('changePasswordBtn')).toBeInTheDocument()

    expect(screen.queryByTestId('confirmModal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('lockAccessBtn'))
    expect(screen.queryByTestId('confirmModal')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'Aa12345678! ' } })
    fireEvent.change(screen.getByTestId('newPassword'), { target: { value: ' Aa87654321!' } })
    fireEvent.change(screen.getByTestId('retypePassword'), { target: { value: ' Aa87654321!' } })
    fireEvent.submit(screen.getByTestId('form'))

    await waitFor(() => {
      expect(put).toBeCalledTimes(1)
      expect(put).toBeCalledWith(
        'http://127.0.0.1:3100/users/password',
        { currentPassword: 'Aa12345678!', newPassword: 'Aa87654321!' },
      )
    })
  })
})
