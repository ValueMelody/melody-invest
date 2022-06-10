import * as constants from '@shared/constants'
import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import RequiredLabel from '../elements/RequiredLabel'
import useAccountUI from './hooks/useAccountUI'
import usePrivateGuard from '../hooks/usePrivateGuard'
import UpgradeModel from './blocks/UpgradeModal'

const useStyles = vendorTool.jss.createUseStyles(({
  input: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
}))

const Setting = () => {
  usePrivateGuard()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { getPasswordError } = useAccountUI()
  const { getUser, updateUserPassword, removeUserToken } = useUserState()
  const { addMessage } = useCommonState()

  const [currentPassword, setCurrentPassword] = vendorTool.react.useState('')
  const [newPassword, setNewPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')

  const user = getUser()

  const userTypeText = vendorTool.react.useMemo(() => {
    switch (user.userType) {
      case constants.User.Type.Premium:
        return {
          title: localeTool.t('common.premium'),
          price: localeTool.t('pricing.premiumPrice'),
          profiles: localeTool.t('pricing.premiumProfiles'),
          envs: localeTool.t('pricing.premiumEnvs'),
        }
      case constants.User.Type.Pro:
        return {
          title: localeTool.t('common.pro'),
          price: localeTool.t('pricing.proPrice'),
          profiles: localeTool.t('pricing.proProfiles'),
          envs: localeTool.t('pricing.proEnvs'),
        }
      case constants.User.Type.Basic:
      default:
        return {
          title: localeTool.t('common.basic'),
          price: localeTool.t('pricing.basicPrice'),
          profiles: localeTool.t('pricing.basicProfiles'),
          envs: localeTool.t('pricing.basicEnvs'),
        }
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
    removeUserToken()
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
                {`${userTypeText.title} ${localeTool.t('common.plan')} - ${userTypeText.price}`}
              </h4>
              <h5>- {userTypeText.profiles}</h5>
              <h5>- {userTypeText.envs}</h5>
            </vendorTool.ui.CardDescription>
          </vendorTool.ui.CardContent>
          {user.userType !== constants.User.Type.Premium && (
            <vendorTool.ui.CardContent extra>
              <UpgradeModel />
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
        <vendorTool.ui.Card>
          <vendorTool.ui.CardContent>
            <vendorTool.ui.CardHeader>
              <h3>{localeTool.t('setting.accountAction')}</h3>
            </vendorTool.ui.CardHeader>
            <vendorTool.ui.CardDescription>
              <vendorTool.ui.Button onClick={handleSignOut}>
                {localeTool.t('setting.signOut')}
              </vendorTool.ui.Button>
            </vendorTool.ui.CardDescription>
          </vendorTool.ui.CardContent>
        </vendorTool.ui.Card>
      </vendorTool.ui.CardGroup>
    </div>
  )
}

export default Setting
