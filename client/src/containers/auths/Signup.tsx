import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Button, Input, Checkbox } from 'semantic-ui-react'
import PasswordValidator from 'password-validator'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../tools/locale'
import useCommon from '../../states/useCommon'
import useUser from '../../states/useUser'
import RequiredLabel from '../auths/elements/RequiredLabel'

const useStyles = createUseStyles(({
  container: {
    height: '80vh',
  },
  title: {
    marginBottom: '2rem',
  },
  row: {
    width: 360,
    marginBottom: '2rem',
  },
}))

const Signup = () => {
  const classes = useStyles()
  const passwordSchema = new PasswordValidator()
  passwordSchema
    .has().min(10, localeTool.t('error.password.requireMin', { num: 10 }))
    .has().uppercase(1, localeTool.t('error.password.requireUpper'))
    .has().lowercase(1, localeTool.t('error.password.requireLower'))
    .has().symbols(1, localeTool.t('error.password.requireSymbol'))

  const { addMessage, clearMessages } = useCommon()
  const { postUser } = useUser()

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
    const parsePassword = password.trim()
    const parseRetypePasswod = retypePassword.trim()
    let error = ''
    if (parsePassword !== parseRetypePasswod) {
      error = localeTool.t('error.password.requireSame')
    } else {
      const errors = passwordSchema.validate(password, { list: true, details: true })
      error = Array.isArray(errors) && errors.length ? errors[0].message : ''
    }
    if (error) {
      addMessage({
        id: Math.random(),
        type: 'error',
        title: error,
      })
    }
    await postUser(email, password, isConfirmed)
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
            label={localeTool.t('signup.terms')}
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

export default Signup
