import SignIn from './SignIn'
import { fireEvent, render, screen } from 'test.utils'
import { createMemoryHistory } from 'history'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as useUserRequest from 'requests/useUserRequest'
import * as useCommonState from 'states/useCommonState'
import * as usePublicGuard from 'handlers/usePublicGuard'

const publicGuard = jest.fn()
// @ts-ignore
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const createUserToken = jest.fn()
// @ts-ignore
jest.spyOn(useUserRequest, 'default').mockImplementation(() => ({
  createUserToken,
}))

const addMessage = jest.fn()
// @ts-ignore
jest.spyOn(useCommonState, 'default').mockImplementation(() => ({
  addMessage,
}))

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
    const checkboxContainer = container.querySelector('.checkbox')!
    expect(checkboxContainer.classList).not.toContain('checked')

    const signInButton = screen.getByTestId('signInButton')
    expect(signInButton.classList).toContain('disabled')

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const pass = '123aBC45678!'
    fireEvent.change(passInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.click(checkboxInput)
    expect(checkboxContainer.classList).toContain('checked')

    expect(signInButton.classList).not.toContain('disabled')
    fireEvent.click(signInButton)

    expect(createUserToken).toBeCalledTimes(1)
    expect(createUserToken).toBeCalledWith('abc@email.com', pass, true)
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
    expect(addMessage).toBeCalledTimes(1)
    expect(addMessage).toBeCalledWith(
      expect.objectContaining({
        title: 'Password must include at least 1 lower case letter!',
      }),
    )
  })
})
