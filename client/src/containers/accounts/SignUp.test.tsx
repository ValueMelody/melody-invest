import * as localeTool from 'tools/locale'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as usePublicGuard from 'hooks/usePublicGuard'
import * as userAction from 'actions/user'
import { fireEvent, render, screen } from 'test.utils'
import SignUp from './SignUp'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

const publicGuard = jest.fn()
// @ts-ignore
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const createUser = jest.fn()
jest.spyOn(userAction, 'createUser')
  .mockImplementation(createAsyncThunk(
    'test/createUserTest',
    createUser,
  ))

afterEach(() => {
  store.dispatch(globalSlice.actions._resetForTest())
  jest.clearAllMocks()
})

describe('#SignUp', () => {
  test('has public guard', () => {
    render(<SignUp />)
    expect(publicGuard).toBeCalled()
  })

  test('could go to signUp', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignUp] })
    render(
      <SignUp />,
      { history },
    )
    const signInButton = screen.getByTestId('signInButton')

    fireEvent.click(signInButton)
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('could trigger signUp', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    const { container } = render(
      <SignUp />,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const confirmPassInput = inputs[2]
    const checkboxInput = inputs[3]

    expect(emailInput.value).toBe('')
    expect(passInput.value).toBe('')
    expect(confirmPassInput.value).toBe('')
    const checkboxContainer = screen.getByTestId('checkbox')
    expect(checkboxContainer).not.toBeChecked()

    const signUpButton = screen.getByTestId('signUpButton')
    expect(signUpButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const pass = '123aBC45678!'
    fireEvent.change(passInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.click(checkboxInput)
    expect(checkboxContainer).toBeChecked()

    expect(signUpButton).not.toBeDisabled()
    fireEvent.click(signUpButton)

    expect(createUser).toBeCalledTimes(1)
    expect(createUser).toBeCalledWith({
      email: 'abc@email.com', password: pass, isConfirmed: true,
    }, expect.anything())
  })

  test('could trigger validation message', async () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    const { container } = render(
      <SignUp />,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const confirmPassInput = inputs[2]
    const checkboxInput = inputs[3]

    const pass = '123ABC45678'
    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    fireEvent.change(passInput, { target: { value: pass } })
    fireEvent.change(confirmPassInput, { target: { value: '123aBC45678123' } })
    fireEvent.click(checkboxInput)

    const signUpButton = screen.getByTestId('signUpButton')
    fireEvent.click(signUpButton)

    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].title).toBe(localeTool.t('error.password.requireSame'))
    expect(createUser).toBeCalledTimes(0)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    fireEvent.click(signUpButton)
    const updatedMessages = store.getState().global.messages
    expect(updatedMessages[updatedMessages.length - 1].title).toBe(
      'Password must include at least 1 lower case letter!',
    )
    expect(createUser).toBeCalledTimes(0)
  })
})
