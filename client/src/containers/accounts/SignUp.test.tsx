import * as localeTool from 'tools/locale'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as usePublicGuard from 'hooks/usePublicGuard'
import * as userAction from 'actions/user'
import { act, fireEvent, render, screen } from 'test.utils'
import axios from 'axios'
import { contentSlice } from 'stores/content'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { store } from 'stores'
import SignUp from './SignUp'

jest.mock('hooks/usePublicGuard', () => {
  const actual = jest.requireActual('hooks/usePublicGuard')
  return {
    __esModule: true,
    ...actual,
  }
})

afterEach(() => {
  jest.clearAllMocks()
  store.dispatch(contentSlice.actions._resetForTest())
})

const get = jest.fn()
jest.spyOn(axios, 'get')
  .mockImplementation(async (url) => {
    get(url)
    if (url.includes('/policy/1')) {
      return {
        data: {
          id: 1,
          type: 1,
          content: '111',
        },
      }
    }
    return {
      data: {
        id: 2,
        type: 2,
        content: '222',
      },
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
  test('has public guard', async () => {
    await act(() => {
      render(<SignUp />)
    })
    expect(publicGuard).toBeCalled()
  })

  test('could go to signIn', async () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignUp] })
    await act(() => {
      render(
        <SignUp />,
        { history },
      )
    })
    const signInButton = screen.getByTestId('signInButton')

    expect(get).toBeCalledTimes(2)
    expect(get).toHaveBeenCalledWith('http://127.0.0.1:3100/system/policy/1')
    expect(get).toHaveBeenCalledWith('http://127.0.0.1:3100/system/policy/2')

    expect(screen.getByTestId('privacyContent').innerHTML).toBe('111')
    expect(screen.getByTestId('termsContent').innerHTML).toBe('222')

    await act(() => {
      fireEvent.click(signInButton)
    })
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('could trigger signUp', async () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.SignIn] })
    await act(() => {
      render(
        <SignUp />,
        { history },
      )
    })

    const emailInput = screen.getByTestId('emailInput') as HTMLInputElement
    const passInput = screen.getByTestId('passInput') as HTMLInputElement
    const confirmPassInput = screen.getByTestId('retypePassInput') as HTMLInputElement
    const checkboxInput = screen.getByTestId('checkbox') as HTMLInputElement

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
    await act(() => {
      render(
        <SignUp />,
        { history },
      )
    })

    const emailInput = screen.getByTestId('emailInput') as HTMLInputElement
    const passInput = screen.getByTestId('passInput') as HTMLInputElement
    const confirmPassInput = screen.getByTestId('retypePassInput') as HTMLInputElement
    const checkboxInput = screen.getByTestId('checkbox') as HTMLInputElement

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
