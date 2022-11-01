import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextInput, Checkbox, Label } from 'flowbite-react'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import usePublicGuard from 'handlers/usePublicGuard'
import usePasswordValidator from 'handlers/usePasswordValidator'
import RequiredLabel from 'containers/elements/RequiredLabel'
import GoToButton from './elements/GoToButton'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'
import { globalSlice } from 'stores/global'

const SignIn = () => {
  usePublicGuard()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { validatePassword } = usePasswordValidator()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shouldRemember, setShouldRemember] = useState(false)

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value)
  }

  const handleToggleRemember = () => {
    setShouldRemember(!shouldRemember)
  }

  const handleClickSignUp = () => {
    navigate(routerTool.signUpRoute())
  }

  const handleClickForgot = () => {
    navigate(routerTool.forgotRoute())
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const error = validatePassword(parsedPassword)
    if (error) {
      dispatch(globalSlice.actions.addMessage({
        type: 'failure',
        title: error,
      }))
      return
    }
    dispatch(actions.createUserToken({
      email: parsedEmail,
      password: parsedPassword,
      shouldRemember,
    }))
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='account-root'>
      <h1 className='account-title'>
        {localeTool.t('signIn.title')}
      </h1>
      <form onSubmit={handleSubmit}>
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.email')}
          />
          <TextInput
            className='account-right'
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </section>
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.password')}
          />
          <TextInput
            className='account-right'
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </section>
        <section className='account-row justify-center mb-6'>
          <Checkbox
            data-testid='checkbox'
            className='mr-2'
            checked={shouldRemember}
            onChange={handleToggleRemember}
          />
          <Label>
            {localeTool.t('signIn.remember')}
          </Label>
        </section>
        <section className='flex justify-center'>
          <Button
            data-testid='signInButton'
            type='submit'
            disabled={!email || !password}
          >
            {localeTool.t('signIn.button')}
          </Button>
        </section>
      </form>
      <footer className='account-footer'>
        <GoToButton
          data-testid='signUpButton'
          className='mb-6'
          title={localeTool.t('signIn.toSignUp')}
          onClick={handleClickSignUp}
        />
        <GoToButton
          data-testid='forgotButton'
          title={localeTool.t('signIn.toReset')}
          onClick={handleClickForgot}
        />
      </footer>
    </section>
  )
}

export default SignIn
