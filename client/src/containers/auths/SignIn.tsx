import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Checkbox } from 'semantic-ui-react'
import * as localeTool from '../../tools/locale'
import RequiredLabel from './elements/RequiredLabel'
import useCommon from '../../states/useCommon'
import useUser from '../../states/useUser'
import * as routerEnum from '../../enums/router'
import useAuth from './useAuth'

const SignIn = () => {
  const navigate = useNavigate()
  const { clearMessages, addMessage } = useCommon()
  const { classes, getPasswordError } = useAuth()
  const { createUserToken } = useUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shouldRemember, setShouldRemember] = useState(false)

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    clearMessages()
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    clearMessages()
  }

  const handleToggleRemember = () => {
    setShouldRemember(!shouldRemember)
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
    await createUserToken(parsedEmail, parsedPassword, shouldRemember)
      .then(() => navigate(routerEnum.NAV.DASHBOARD))
  }

  return (
    <div className={classNames(classes.container, 'column-center')}>
      <h2 className={classes.title}>{localeTool.t('signIn.title')}</h2>
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
        <div className={classes.row}>
          <Checkbox
            label={localeTool.t('signIn.remember')}
            checked={shouldRemember}
            onChange={handleToggleRemember}
          />
        </div>
        <div className='row-around'>
          <Button
            type='submit'
            color='blue'
            disabled={!email || !password}
          >
            {localeTool.t('signIn.button')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignIn
