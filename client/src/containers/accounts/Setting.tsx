import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Input, Button, Segment } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../tools/locale'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import RequiredLabel from '../elements/RequiredLabel'
import useAccountInterface from './hooks/useAccountInterface'
import usePrivateGuard from '../hooks/usePrivateGuard'

const useStyles = createUseStyles(({
  email: {
    marginBottom: '2rem !important',
  },
  container: {
    padding: '2rem !important',
  },
}))

const Setting = () => {
  usePrivateGuard()
  const classes = useStyles()

  const { classes: accountClasses, getPasswordError } = useAccountInterface()
  const { userEmail, updateUserPassword } = useUserState()
  const { addMessage, clearMessages } = useCommonState()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')

  const handleChangeCurrentPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value)
    clearMessages()
  }

  const handleChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    clearMessages()
  }

  const handleChangeRetypePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRetypePassword(e.target.value)
    clearMessages()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const parsedCurrentPassword = currentPassword.trim()
    const parsedNewPassword = newPassword.trim()
    const parsedRetypePasswod = retypePassword.trim()

    const formatError = getPasswordError(parsedCurrentPassword) || getPasswordError(parsedNewPassword)
    const error = parsedNewPassword !== parsedRetypePasswod
      ? localeTool.t('error.password.requireSame')
      : formatError
    if (error) {
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    updateUserPassword(parsedCurrentPassword, parsedNewPassword)
  }

  return (
    <div className={classNames(accountClasses.container, 'column-center')}>
      <h2 className={accountClasses.title}>{localeTool.t('setting.title')}</h2>
      <h3 className={classes.email}>
        {localeTool.t('common.email')}: {userEmail}
      </h3>
      <Segment className={classes.container}>
        <form onSubmit={handleSubmit}>
          <div className={classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.currentPassword')} />
            <Input
              type='password'
              value={currentPassword}
              onChange={handleChangeCurrentPassword}
            />
          </div>
          <div className={classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.newPassword')} />
            <Input
              type='password'
              value={newPassword}
              onChange={handleChangeNewPassword}
            />
          </div>
          <div className={classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.retypePassword')} />
            <Input
              type='password'
              value={retypePassword}
              onChange={handleChangeRetypePassword}
            />
          </div>
          <div className='row-around'>
            <Button
              type='submit'
              color='blue'
              disabled={!currentPassword || !newPassword || !retypePassword}
            >
              {localeTool.t('setting.changePassword')}
            </Button>
          </div>
        </form>
      </Segment>
    </div>
  )
}

export default Setting
