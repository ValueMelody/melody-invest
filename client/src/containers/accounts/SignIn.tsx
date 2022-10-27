import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Button, TextInput, Checkbox, Label } from 'flowbite-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import useCommonState from 'states/useCommonState'
import usePublicGuard from 'handlers/usePublicGuard'
import usePasswordValidator from 'handlers/usePasswordValidator'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'
import GoToButton from './elements/GoToButton'

const useStyles = createUseStyles(({
  input: {
    width: 280,
  },
  forgotButton: {
    marginTop: '2rem !important',
  },
}))

const SignIn = () => {
  usePublicGuard()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()
  const { accountClasses } = useAccountStyle()
  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { createUserToken } = useUserRequest()

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
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await createUserToken(parsedEmail, parsedPassword, shouldRemember)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('signIn.title')}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <TextInput
            className={classes.input}
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.password')} />
          <TextInput
            className={classes.input}
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={classNames(
          accountClasses.row,
          'items-center',
        )}>
          <Checkbox
            data-testid='checkbox'
            className='mr-2'
            checked={shouldRemember}
            onChange={handleToggleRemember}
          />
          <Label>{localeTool.t('signIn.remember')}</Label>
        </div>
        <div className={commonClasses.rowAround}>
          <Button
            data-testid='signInButton'
            type='submit'
            disabled={!email || !password}
          >
            {localeTool.t('signIn.button')}
          </Button>
        </div>
      </form>
      <div className={accountClasses.row}>
        <div className={commonClasses.columnCenter}>
          <GoToButton
            data-testid='signUpButton'
            className='mt-8'
            title={localeTool.t('signIn.toSignUp')}
            onClick={handleClickSignUp}
          />
          <GoToButton
            data-testid='forgotButton'
            className='mt-8'
            title={localeTool.t('signIn.toReset')}
            onClick={handleClickForgot}
          />
        </div>
      </div>
    </div>
  )
}

export default SignIn
