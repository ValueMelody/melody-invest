import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as usePublicGuard from 'hooks/usePublicGuard'
import * as userAction from 'actions/user'
import { fireEvent, render, screen } from 'test.utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { createMemoryHistory } from 'history'
import Forgot from './Forgot'

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

const createResetEmail = jest.fn()
jest.spyOn(userAction, 'createResetEmail')
  .mockImplementation(createAsyncThunk(
    'test/createResetEmailTest',
    createResetEmail,
  ))

describe('#Forgot', () => {
  test('has public guard', () => {
    render(<Forgot />)
    expect(publicGuard).toBeCalled()
  })

  test('could go to signIn', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    render(<Forgot />, { history })
    const signInText = localeTool.t('signUp.toSignIn')
    const signInButton = screen.getByText(signInText)

    fireEvent.click(signInButton)
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('could submit with correct email', async () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const { container } = render(<Forgot />, { history })
    const emailInput = container.querySelector('input')!
    expect(emailInput.value).toBe('')

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const button = container.querySelector('button')!
    fireEvent.click(button)

    expect(createResetEmail).toBeCalledTimes(1)
    expect(createResetEmail).toBeCalledWith(
      'abc@email.com', expect.anything(),
    )
  })
})
