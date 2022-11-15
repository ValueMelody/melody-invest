import { Routes, Route } from 'react-router-dom'
import Reset from './Reset'
import { fireEvent, render, screen } from 'test.utils'
import { createMemoryHistory } from 'history'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import * as usePublicGuard from 'hooks/usePublicGuard'
import { store } from 'stores'
import * as userAction from 'actions/user'
import { createAsyncThunk } from '@reduxjs/toolkit'

const publicGuard = jest.fn()
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const resetUserPassword = jest.fn()
jest.spyOn(userAction, 'resetUserPassword')
  .mockImplementation(createAsyncThunk(
    'test/resetUserPasswordTest',
    resetUserPassword,
  ))

afterEach(() => {
  jest.clearAllMocks()
})

describe('#Forgot', () => {
  test('has public guard', () => {
    render(<Reset />)
    expect(publicGuard).toBeCalled()
  })

  test('could go to signIn', () => {
    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Reset}/112233`] })
    render(
      <Routes>
        <Route
          path={`${routerEnum.Nav.Reset}/:code`}
          element={<Reset />}
        />
      </Routes>,
      { history },
    )
    const signInButton = screen.getByTestId('loginButton')

    fireEvent.click(signInButton)
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('could trigger reset', () => {
    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Reset}/112233`] })
    const { container } = render(
      <Routes>
        <Route
          path={`${routerEnum.Nav.Reset}/:code`}
          element={<Reset />}
        />
      </Routes>,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const confirmPassInput = inputs[2]

    expect(emailInput.value).toBe('')
    expect(passInput.value).toBe('')
    expect(confirmPassInput.value).toBe('')

    const resetButton = screen.getByTestId('resetButton')

    expect(resetButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const pass = '123aBC45678!'

    fireEvent.change(passInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    expect(confirmPassInput.value).toBe(pass)

    expect(resetButton).not.toBeDisabled()

    fireEvent.click(resetButton)
    expect(resetUserPassword).toBeCalledTimes(1)
    expect(resetUserPassword).toBeCalledWith({
      email: 'abc@email.com', password: pass, resetCode: '112233',
    }, expect.anything())
  })

  test('could trigger validation message', () => {
    const history = createMemoryHistory({ initialEntries: [`${routerEnum.Nav.Reset}/112233`] })
    const { container } = render(
      <Routes>
        <Route
          path={`${routerEnum.Nav.Reset}/:code`}
          element={<Reset />}
        />
      </Routes>,
      { history },
    )

    const inputs = container.querySelectorAll('input')
    const emailInput = inputs[0]
    const passInput = inputs[1]
    const confirmPassInput = inputs[2]

    const pass = '123ABC45678'
    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    fireEvent.change(passInput, { target: { value: pass } })
    fireEvent.change(confirmPassInput, { target: { value: '123aBC45678123' } })

    const resetText = localeTool.t('reset.button')
    const resetButton = screen.getByText(resetText)

    fireEvent.click(resetButton)

    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].title).toBe(localeTool.t('error.password.requireSame'))
    expect(resetUserPassword).toBeCalledTimes(0)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    fireEvent.click(resetButton)
    const updatedMessages = store.getState().global.messages
    expect(updatedMessages[updatedMessages.length - 1].title).toBe(
      'Password must include at least 1 lower case letter!',
    )
    expect(resetUserPassword).toBeCalledTimes(0)
  })
})
