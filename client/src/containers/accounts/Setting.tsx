import * as constants from '@shared/constants'
import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import useUserRequest from '../../requests/useUserRequest'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import RequiredLabel from '../elements/RequiredLabel'
import useAccountUI from './hooks/useAccountUI'
import usePrivateGuard from '../hooks/usePrivateGuard'
import SubscribeModal from './blocks/SubscribeModal'
import UnsubscribeButton from './blocks/UnsubscribeButton'
import * as commonEnum from '../../enums/common'

const useStyles = vendorTool.jss.createUseStyles(({
  input: {
    marginTop: '2rem !important',
  },
  planDate: {
    marginTop: '1rem !important',
  },
}))

const Setting = () => {
  usePrivateGuard()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { getPasswordError } = useAccountUI()
  const { updateUserPassword } = useUserRequest()
  const { getUser, removeUser } = useUserState()
  const { addMessage } = useCommonState()

  const [currentPassword, setCurrentPassword] = vendorTool.react.useState('')
  const [newPassword, setNewPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')

  const user = getUser()

  const userTypeText = vendorTool.react.useMemo(() => {
    switch (user.userType) {
      case constants.User.Type.Premium:
        return commonEnum.Plan.Premium
      case constants.User.Type.Pro:
        return commonEnum.Plan.Pro
      case constants.User.Type.Basic:
      default:
        return commonEnum.Plan.Basic
    }
  }, [user.userType])

  // ------------------------------------------------------------ Handler --

  const handleChangeCurrentPassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(e.target.value)
  }

  const handleChangeNewPassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(e.target.value)
  }

  const handleChangeRetypePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setRetypePassword(e.target.value)
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
    removeUser()
  }

  // ------------------------------------------------------------ UI --

  return (
    <div>
      <vendorTool.ui.CardGroup>
        <vendorTool.ui.Card>
          <vendorTool.ui.CardContent>
            <vendorTool.ui.CardHeader>
              <h3>{localeTool.t('setting.accountInfo')}</h3>
            </vendorTool.ui.CardHeader>
            <vendorTool.ui.CardDescription>
              <h4>{localeTool.t('common.email')}: {user.userEmail}</h4>
              <vendorTool.ui.Button
                className={classes.input}
                onClick={handleSignOut}
              >
                {localeTool.t('setting.signOut')}
              </vendorTool.ui.Button>
            </vendorTool.ui.CardDescription>
          </vendorTool.ui.CardContent>
        </vendorTool.ui.Card>
        <vendorTool.ui.Card>
          <vendorTool.ui.CardContent>
            <vendorTool.ui.CardHeader>
              <h3>{localeTool.t('setting.accountType')}</h3>
            </vendorTool.ui.CardHeader>
            <vendorTool.ui.CardDescription>
              <h4>
                {`${userTypeText.Title} ${localeTool.t('common.plan')} - ${userTypeText.Price}`}
              </h4>
              {userTypeText.Services.map((service) => (
                <h5 key={service}>- {service}</h5>
              ))}
              {user.userType !== constants.User.Type.Basic && !user.planEndAtUTC && (
                <UnsubscribeButton />
              )}
              {user.planStartAtUTC && (
                <h5 className={classes.planDate}>
                  {localeTool.t('setting.planStartAt', { date: user.planStartAtUTC })}
                </h5>
              )}
              {user.planEndAtUTC && (
                <h5 className={classes.planDate}>
                  {localeTool.t('setting.planEndAt', { date: user.planEndAtUTC })}
                </h5>
              )}
            </vendorTool.ui.CardDescription>
          </vendorTool.ui.CardContent>
          {user.userType === constants.User.Type.Basic && (
            <vendorTool.ui.CardContent extra>
              <SubscribeModal />
            </vendorTool.ui.CardContent>
          )}
        </vendorTool.ui.Card>
        <vendorTool.ui.Card>
          <vendorTool.ui.CardContent>
            <vendorTool.ui.CardHeader>
              <h3>{localeTool.t('setting.changePassword')}</h3>
            </vendorTool.ui.CardHeader>
            <vendorTool.ui.CardDescription>
              <form onSubmit={handleSubmit}>
                <RequiredLabel title={localeTool.t('common.currentPassword')} />
                <vendorTool.ui.Input
                  type='password'
                  value={currentPassword}
                  onChange={handleChangeCurrentPassword}
                  className={classes.input}
                />
                <RequiredLabel title={localeTool.t('common.newPassword')} />
                <vendorTool.ui.Input
                  type='password'
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  className={classes.input}
                />
                <RequiredLabel title={localeTool.t('common.retypePassword')} />
                <vendorTool.ui.Input
                  type='password'
                  value={retypePassword}
                  onChange={handleChangeRetypePassword}
                  className={classes.input}
                />
                <vendorTool.ui.Button
                  type='submit'
                  color='blue'
                  disabled={!currentPassword || !newPassword || !retypePassword}
                  className={classes.input}
                >
                  {localeTool.t('setting.changePassword')}
                </vendorTool.ui.Button>
              </form>
            </vendorTool.ui.CardDescription>
          </vendorTool.ui.CardContent>
        </vendorTool.ui.Card>
      </vendorTool.ui.CardGroup>
    </div>
  )
}

export default Setting
