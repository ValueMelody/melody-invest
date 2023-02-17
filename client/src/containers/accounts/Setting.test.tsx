import { act, fireEvent, render, screen, waitFor } from 'test.utils'
import Setting from './Setting'
import axios from 'axios'
import * as generalAction from 'actions/general'

jest.mock('actions/general', () => {
  const actual = jest.requireActual('actions/general')
  return {
    __esModule: true,
    ...actual,
  }
})

const logout = jest.fn()
jest.spyOn(generalAction, 'logout')
  .mockImplementation(() => {
    logout()
    return { payload: undefined, type: 'general/logout' }
  })

describe('#Setting', () => {
  test('could render buttons', async () => {
    const put = jest.fn()
    jest.spyOn(axios, 'put').mockImplementation(put)

    act(() => {
      render(<Setting />)
    })

    fireEvent.click(screen.getByTestId('signOutBtn'))
    await waitFor(() => {
      expect(logout).toBeCalledTimes(1)
    })

    expect(screen.queryByTestId('changePasswordBtn')).toBeInTheDocument()

    expect(screen.queryByTestId('confirmModal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('lockAccessBtn'))
    expect(screen.queryByTestId('confirmModal')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('confirmModalCloseBtn'))
    expect(screen.queryByTestId('confirmModal')).not.toBeInTheDocument()

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
