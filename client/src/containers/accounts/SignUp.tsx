import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Input, TextArea, Button, Checkbox } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import useSystemRequest from 'requests/useSystemRequest'
import useCommonState from 'states/useCommonState'
import useResourceState from 'states/useResourceState'
import usePublicGuard from 'handlers/usePublicGuard'
import usePasswordValidator from 'handlers/usePasswordValidator'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'

const useStyles = createUseStyles(({
  policy: {
    padding: '1rem',
    height: 280,
    width: '100%',
  },
}))

const SignUp = () => {
  usePublicGuard()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()

  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { createUser } = useUserRequest()
  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!policy.termsPolicy) fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    // eslint-disable-next-line
  }, [policy.termsPolicy])

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

  const handleToggleTerms = () => {
    setIsConfirmed(!isConfirmed)
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
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await createUser(parsedEmail, parsedPassword, isConfirmed)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('signUp.title')}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <Input
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
          <Input
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
          <Input
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={accountClasses.row}>
          <TextArea
            className={classes.policy}
            disabled
            value={policy.termsPolicy || ''}
          />
        </div>
        <div className={accountClasses.row}>
          <Checkbox
            label={localeTool.t('signUp.terms')}
            checked={isConfirmed}
            onChange={handleToggleTerms}
          />
        </div>
        <div className={commonClasses.rowAround}>
          <Button
            data-testid='signUpButton'
            type='submit'
            color='blue'
            disabled={!email || !password || !retypePassword || !isConfirmed}
          >
            {localeTool.t('common.signUp')}
          </Button>
        </div>
      </form>
      <Button
        data-testid='signInButton'
        className={accountClasses.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signUp.toSignIn')}
        onClick={handleClickSignIn}
      />
    </div>
  )
}

export default SignUp
