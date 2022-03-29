import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Button, Input, Checkbox } from 'semantic-ui-react'
import * as localeTool from '../../tools/locale'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import useAccountInterface from './hooks/useAccountInterface'
import RequiredLabel from '../elements/RequiredLabel'
import usePublicGuard from '../hooks/usePublicGuard'

const SignUp = () => {
  usePublicGuard()

  const { classes, getPasswordError } = useAccountInterface()
  const { addMessage, clearMessages } = useCommonState()
  const { createUser } = useUserState()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    clearMessages()
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    clearMessages()
  }

  const handleChangeRetypePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRetypePassword(e.target.value)
    clearMessages()
  }

  const handleToggleTerms = () => {
    setIsConfirmed(!isConfirmed)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const parsedRetypePasswod = retypePassword.trim()
    const error = parsedPassword !== parsedRetypePasswod
      ? localeTool.t('error.password.requireSame')
      : getPasswordError(parsedPassword)
    if (error) {
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await createUser(parsedEmail, parsedPassword, isConfirmed)
  }

  return (
    <div className={classNames(classes.container, 'column-center')}>
      <h2 className={classes.title}>{localeTool.t('signUp.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className={classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <Input
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.password')} />
          <Input
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.retypePassword')} />
          <Input
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={classes.row}>
          <Checkbox
            label={localeTool.t('signUp.terms')}
            checked={isConfirmed}
            onChange={handleToggleTerms}
          />
        </div>
        <div className='row-around'>
          <Button
            type='submit'
            color='blue'
            disabled={!email || !password || !retypePassword || !isConfirmed}
          >
            {localeTool.t('signUp.button')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUp
