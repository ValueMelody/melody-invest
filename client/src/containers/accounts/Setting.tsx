import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import RequiredLabel from '../elements/RequiredLabel'
import useAccountUI from './hooks/useAccountUI'
import usePrivateGuard from '../hooks/usePrivateGuard'

const useStyles = vendorTool.jss.createUseStyles(({
  email: {
    marginBottom: '2rem !important',
  },
  container: {
    padding: '2rem !important',
  },
}))

const Setting = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const { classes: accountClasses, getPasswordError } = useAccountUI()
  const { getUser, updateUserPassword, removeUserToken } = useUserState()
  const { addMessage, clearMessages } = useCommonState()

  const [currentPassword, setCurrentPassword] = vendorTool.react.useState('')
  const [newPassword, setNewPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')

  const user = getUser()

  // ------------------------------------------------------------ Handler --

  const handleChangeCurrentPassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(e.target.value)
    clearMessages()
  }

  const handleChangeNewPassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(e.target.value)
    clearMessages()
  }

  const handleChangeRetypePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setRetypePassword(e.target.value)
    clearMessages()
  }

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
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

  const handleSignOut = () => {
    removeUserToken()
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={vendorTool.classNames(accountClasses.container, 'column-center')}>
      <h2 className={accountClasses.title}>{localeTool.t('setting.title')}</h2>
      <h3 className={classes.email}>
        {localeTool.t('common.email')}: {user.userEmail}
      </h3>
      <vendorTool.ui.Segment className={classes.container}>
        <form onSubmit={handleSubmit}>
          <div className={vendorTool.classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.currentPassword')} />
            <vendorTool.ui.Input
              type='password'
              value={currentPassword}
              onChange={handleChangeCurrentPassword}
            />
          </div>
          <div className={vendorTool.classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.newPassword')} />
            <vendorTool.ui.Input
              type='password'
              value={newPassword}
              onChange={handleChangeNewPassword}
            />
          </div>
          <div className={vendorTool.classNames('row-between', accountClasses.row)}>
            <RequiredLabel title={localeTool.t('common.retypePassword')} />
            <vendorTool.ui.Input
              type='password'
              value={retypePassword}
              onChange={handleChangeRetypePassword}
            />
          </div>
          <div className='row-around'>
            <vendorTool.ui.Button
              type='submit'
              color='blue'
              disabled={!currentPassword || !newPassword || !retypePassword}
            >
              {localeTool.t('setting.changePassword')}
            </vendorTool.ui.Button>
          </div>
        </form>
      </vendorTool.ui.Segment>
      <vendorTool.ui.Button onClick={handleSignOut}>
        {localeTool.t('setting.signOut')}
      </vendorTool.ui.Button>
    </div>
  )
}

export default Setting
