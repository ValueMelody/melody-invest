import * as commonEnum from 'enums/common'
import * as generalAction from 'actions/general'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen, waitFor } from 'test.utils'
import Setting from './Setting'
import axios from 'axios'
import { UserState } from 'stores/user'
import { mock, instance } from 'ts-mockito'

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

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const userType = mock<UserState>({})

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

    await act(() => {
      fireEvent.click(screen.getByTestId('confirmLockBtn'))
    })
    expect(put).toBeCalledTimes(1)
    expect(put).toBeCalledWith('http://127.0.0.1:3100/users/lock', undefined)

    fireEvent.click(screen.getByTestId('confirmModalCloseBtn'))
    expect(screen.queryByTestId('confirmModal')).not.toBeInTheDocument()

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'Aa12345678! ' } })
    fireEvent.change(screen.getByTestId('newPassword'), { target: { value: ' Aa87654321!' } })
    fireEvent.change(screen.getByTestId('retypePassword'), { target: { value: ' Aa87654321' } })
    fireEvent.submit(screen.getByTestId('form'))
    expect(put).toBeCalledTimes(1)

    fireEvent.change(screen.getByTestId('retypePassword'), { target: { value: ' Aa87654321!' } })
    fireEvent.submit(screen.getByTestId('form'))

    await waitFor(() => {
      expect(put).toBeCalledTimes(2)
      expect(put).toBeCalledWith(
        'http://127.0.0.1:3100/users/password',
        { currentPassword: 'Aa12345678!', newPassword: 'Aa87654321!' },
      )
    })
  })

  test('basic user', () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        userType: 1,
      }))

    render(<Setting />)

    expect(screen.getByTestId('userPlan').innerHTML).toContain(commonEnum.Plan.Basic.Title)
  })

  test('pro user', () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        userType: 2,
      }))

    render(<Setting />)

    expect(screen.getByTestId('userPlan').innerHTML).toContain(commonEnum.Plan.Pro.Title)
  })

  test('premium user', () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        userType: 3,
      }))

    render(<Setting />)

    expect(screen.getByTestId('userPlan').innerHTML).toContain(commonEnum.Plan.Premium.Title)
  })
})
