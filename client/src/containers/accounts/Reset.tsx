import * as actions from 'actions'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { Button, TextInput } from 'flowbite-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RequiredLabel from 'containers/elements/RequiredLabel'
import { globalSlice } from 'stores/global'
import { useDispatch } from 'react-redux'
import usePasswordValidator from 'hooks/usePasswordValidator'
import usePublicGuard from 'hooks/usePublicGuard'
import GoToButton from './elements/GoToButton'

const Reset = () => {
  usePublicGuard()

  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { validatePassword } = usePasswordValidator()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')

  const resetCode = params.code || ''

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
            title={localeTool.t('account.email')}
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
            title={localeTool.t('account.newPassword')}
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
            title={localeTool.t('account.retypePassword')}
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
          title={localeTool.t('reset.backBtn')}
          onClick={handleClickSignIn}
        />
      </footer>
    </section>
  )
}

export default Reset
