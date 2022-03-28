import { useState, ChangeEvent, FormEvent } from 'react'
import classNames from 'classnames'
import { Input, Button } from 'semantic-ui-react'
import * as localeTool from '../../tools/locale'
import useUserState from '../../states/useUserState'
import RequiredLabel from './elements/RequiredLabel'
import useAccountInterface from './hooks/useAccountInterface'
import usePrivateGuard from '../hooks/usePrivateGuard'

const Setting = () => {
  usePrivateGuard()

  const { classes } = useAccountInterface()
  const { userEmail } = useUserState()

  const [password, setPassword] = useState('')

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className={classNames(classes.container, 'column-center')}>
      <h2 className={classes.title}>{localeTool.t('signIn.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className={classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <Input
            type='email'
            value={userEmail}
            disabled
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
            disabled={!password}
          >
            {localeTool.t('signIn.button')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Setting
