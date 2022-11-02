import Forgot from './Forgot'
import { act, fireEvent, render, screen, waitFor } from 'test.utils'
import { createMemoryHistory } from 'history'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import * as usePublicGuard from 'handlers/usePublicGuard'
import * as requestAdapter from 'adapters/request'

const publicGuard = jest.fn()
// @ts-ignore
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const createResetEmail = jest.fn()
jest.spyOn(requestAdapter, 'sendPostRequest').mockImplementation(createResetEmail)

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
      'http://127.0.0.1:3100/users/reset',
      { email: 'abc@email.com' },
    )

    await waitFor(() => {
      expect(history.location.pathname).toBe(routerTool.signInRoute())
    })
  })
})
