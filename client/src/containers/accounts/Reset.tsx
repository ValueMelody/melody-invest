import { useNavigate, useParams } from 'react-router-dom'
import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Button, TextInput } from 'flowbite-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useCommonState from 'states/useCommonState'
import useUserRequest from 'requests/useUserRequest'
import usePasswordValidator from 'handlers/usePasswordValidator'
import usePublicGuard from 'handlers/usePublicGuard'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'
import GoToButton from './elements/GoToButton'

const useStyles = createUseStyles(({
  input: {
    width: 280,
  },
}))

const Reset = () => {
  usePublicGuard()
  const navigate = useNavigate()
  const params = useParams()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { resetUserPassword } = useUserRequest()

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
      addMessage({ id: Math.random(), type: 'failure', title: error })
      return
    }
    await resetUserPassword(parsedEmail, parsedPassword, resetCode)
  }

  // ------------------------------------------------------------ UI --

  if (!resetCode) return null

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('reset.title')}
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
          <RequiredLabel title={localeTool.t('common.newPassword')} />
          <TextInput
            className={classes.input}
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.retypePassword')} />
          <TextInput
            className={classes.input}
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={commonClasses.rowAround}>
          <Button
            type='submit'
            data-testid='resetButton'
            disabled={!email || !password || !retypePassword}
          >
            {localeTool.t('reset.button')}
          </Button>
        </div>
      </form>
      <footer className='mt-16 flex justify-center'>
        <GoToButton
          data-testid='loginButton'
          title={localeTool.t('common.backToLogin')}
          onClick={handleClickSignIn}
        />
      </footer>
    </div>
  )
}

export default Reset
