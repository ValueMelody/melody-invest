import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as usePublicGuard from 'hooks/usePublicGuard'
import * as userAction from 'actions/user'
import { fireEvent, render, screen } from 'test.utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { store } from 'stores'
import SignIn from './SignIn'

jest.mock('hooks/usePublicGuard', () => {
  const actual = jest.requireActual('hooks/usePublicGuard')
  return {
    __esModule: true,
    ...actual,
  }
})

jest.mock('actions/user', () => {
  const actual = jest.requireActual('actions/user')
  return {
    __esModule: true,
    ...actual,
  }
})

const publicGuard = jest.fn()
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const createUserToken = jest.fn()
jest.spyOn(userAction, 'createUserToken')
  .mockImplementation(createAsyncThunk(
    'test/createUserTokenTest',
    createUserToken,
  ))

afterEach(() => {
  jest.clearAllMocks()
})

describe('#SignIn', () => {
  test('has public guard', () => {
    render(<SignIn />)
    expect(publicGuard).toBeCalled()
  })

  test('could go to signUp', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    render(
      <SignIn />,
      { history },
    )
    const signUpButton = screen.getByTestId('signUpButton')

    fireEvent.click(signUpButton)
    expect(history.location.pathname).toBe(routerTool.signUpRoute())
  })

  test('could go to forgot', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    render(
      <SignIn />,
      { history },
    )
    const forgotButton = screen.getByTestId('forgotButton')

    fireEvent.click(forgotButton)
    expect(history.location.pathname).toBe(routerTool.forgotRoute())
  })

  test('could trigger signIn', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    const { container } = render(
      <SignIn />,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const checkboxInput = inputs[2]

    expect(emailInput.value).toBe('')
    expect(passInput.value).toBe('')
    const checkboxContainer = screen.getByTestId('checkbox')
    expect(checkboxContainer).not.toBeChecked()

    const signInButton = screen.getByTestId('signInButton')
    expect(signInButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const pass = '123aBC45678!'
    fireEvent.change(passInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.click(checkboxInput)
    expect(checkboxContainer).toBeChecked()

    expect(signInButton).not.toBeDisabled()
    fireEvent.click(signInButton)

    expect(createUserToken).toBeCalledTimes(1)
    expect(createUserToken).toBeCalledWith({
      email: 'abc@email.com', password: pass, shouldRemember: true,
    }, expect.anything())
  })

  test('could trigger validation message', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    const { container } = render(
      <SignIn />,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const checkboxInput = inputs[2]
    const signInButton = screen.getByTestId('signInButton')

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    fireEvent.change(passInput, { target: { value: '123ABC45678' } })
    fireEvent.click(checkboxInput)

    fireEvent.click(signInButton)

    expect(createUserToken).toBeCalledTimes(0)

    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].title).toBe('Password must include at least 1 lower case letter!')
  })
})
