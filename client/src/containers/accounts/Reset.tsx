import { useNavigate, useParams } from 'react-router-dom'
import { useState, ChangeEvent, FormEvent } from 'react'
import { Button, TextInput } from 'flowbite-react'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as actions from 'actions'
import usePasswordValidator from 'handlers/usePasswordValidator'
import usePublicGuard from 'handlers/usePublicGuard'
import RequiredLabel from 'containers/elements/RequiredLabel'
import GoToButton from './elements/GoToButton'
import { useDispatch } from 'react-redux'
import { globalSlice } from 'stores/global'

const Reset = () => {
  usePublicGuard()

  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

  const { validatePassword } = usePasswordValidator()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')

  const resetCode = params.code || ''

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

  const handleChangeRetypePassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setRetypePassword(e.target.value)
  }

  const handleClickSignIn = () => {
    navigate(routerTool.signInRoute())
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const parsedRetypePasswod = retypePassword.trim()
    const error = parsedPassword !== parsedRetypePasswod
      ? localeTool.t('error.password.requireSame')
      : validatePassword(parsedPassword)
    if (error) {
      dispatch(globalSlice.actions.addMessage({
        type: 'failure',
        title: error,
      }))
      return
    }
    dispatch(actions.resetUserPassword({
      email: parsedEmail,
      password: parsedPassword,
      resetCode,
    })).then((res: any) => {
      if (!res.error) navigate(routerTool.signInRoute())
    })
  }

  // ------------------------------------------------------------ UI --

  if (!resetCode) return null

  return (
    <section className='account-root'>
      <h1 className='account-title'>
        {localeTool.t('reset.title')}
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
            title={localeTool.t('common.newPassword')}
          />
          <TextInput
            className='account-right'
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </section>
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.retypePassword')}
          />
          <TextInput
            className='account-right'
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </section>
        <div className='flex flex-col items-center'>
          <Button
            type='submit'
            data-testid='resetButton'
            disabled={!email || !password || !retypePassword}
          >
            {localeTool.t('reset.button')}
          </Button>
        </div>
      </form>
      <footer className='account-footer'>
        <GoToButton
          data-testid='loginButton'
          title={localeTool.t('common.backToLogin')}
          onClick={handleClickSignIn}
        />
      </footer>
    </section>
  )
}

export default Reset
