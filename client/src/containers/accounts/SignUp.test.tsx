import SignUp from './SignUp'
import { fireEvent, render, screen } from 'test.utils'
import { createMemoryHistory } from 'history'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import * as useUserRequest from 'requests/useUserRequest'
import * as useCommonState from 'states/useCommonState'
import * as usePublicGuard from 'handlers/usePublicGuard'

const publicGuard = jest.fn()
// @ts-ignore
jest.spyOn(usePublicGuard, 'default').mockImplementation(publicGuard)

const createUser = jest.fn()
// @ts-ignore
jest.spyOn(useUserRequest, 'default').mockImplementation(() => ({
  createUser,
}))

const addMessage = jest.fn()
// @ts-ignore
jest.spyOn(useCommonState, 'default').mockImplementation(() => ({
  addMessage,
}))

afterEach(() => {
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
    const checkboxContainer = container.querySelector('.checkbox')!
    expect(checkboxContainer.classList).not.toContain('checked')

    const signUpButton = screen.getByTestId('signUpButton')
    expect(signUpButton.classList).toContain('disabled')

    fireEvent.change(emailInput, { target: { value: ' AbC@email.Com ' } })
    expect(emailInput.value).toBe('AbC@email.Com')

    const pass = '123aBC45678!'
    fireEvent.change(passInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    expect(passInput.value).toBe(pass)

    fireEvent.click(checkboxInput)
    expect(checkboxContainer.classList).toContain('checked')

    expect(signUpButton.classList).not.toContain('disabled')
    fireEvent.click(signUpButton)

    expect(createUser).toBeCalledTimes(1)
    expect(createUser).toBeCalledWith('abc@email.com', pass, true)
  })

  test('could trigger validation message', () => {
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

    expect(addMessage).toBeCalledTimes(1)
    expect(addMessage).toBeCalledWith(
      expect.objectContaining({
        title: localeTool.t('error.password.requireSame'),
      }),
    )
    expect(createUser).toBeCalledTimes(0)

    fireEvent.change(confirmPassInput, { target: { value: pass } })
    fireEvent.click(signUpButton)
    expect(addMessage).toBeCalledTimes(2)
    expect(addMessage).toBeCalledWith(
      expect.objectContaining({
        title: 'Password must include at least 1 lower case letter!',
      }),
    )
    expect(createUser).toBeCalledTimes(0)
  })
})
