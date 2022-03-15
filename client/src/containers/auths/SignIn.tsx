import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Input, Button } from 'semantic-ui-react'
import * as localeTool from '../../tools/locale'
import RequiredLabel from './elements/RequiredLabel'
import useStore from '../../states/useStore'
import useUser from '../../states/useUser'
import useAuth from './useAuth'

const SignIn = () => {
  const { clearMessages, addMessage } = useStore()
  const { classes, getPasswordError } = useAuth()
  const { getUserToken } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    clearMessages()
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    clearMessages()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const error = getPasswordError(parsedPassword)
    if (error) {
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await getUserToken(parsedEmail, parsedPassword)
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
        <div className='row-around'>
          <Button
            type='submit'
            color='blue'
            disabled={!email || !password}
          >
            {localeTool.t('signUp.button')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignIn
