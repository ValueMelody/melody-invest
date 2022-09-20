import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useCommonState from 'states/useCommonState'
import useUserRequest from 'requests/useUserRequest'
import usePasswordValidator from 'handlers/usePasswordValidator'
import usePublicGuard from 'handlers/usePublicGuard'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'

const useStyles = vendorTool.jss.createUseStyles(({
  input: {
    width: 280,
  },
}))

const Reset = () => {
  usePublicGuard()
  const navigate = vendorTool.router.useNavigate()
  const params = vendorTool.router.useParams()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { resetUserPassword } = useUserRequest()

  const [email, setEmail] = vendorTool.react.useState('')
  const [password, setPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')

  const resetCode = params.code || ''

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value)
  }

  const handleChangeRetypePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setRetypePassword(e.target.value)
  }

  const handleClickSignIn = () => {
    navigate(routerTool.signInRoute())
  }

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
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
    await resetUserPassword(parsedEmail, parsedPassword, resetCode)
  }

  // ------------------------------------------------------------ UI --

  if (!resetCode) return null

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('reset.title')}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={vendorTool.classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <vendorTool.ui.Input
            className={classes.input}
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={vendorTool.classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.newPassword')} />
          <vendorTool.ui.Input
            className={classes.input}
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={vendorTool.classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.retypePassword')} />
          <vendorTool.ui.Input
            className={classes.input}
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={commonClasses.rowAround}>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            disabled={!email || !password || !retypePassword}
          >
            {localeTool.t('reset.button')}
          </vendorTool.ui.Button>
        </div>
      </form>
      <vendorTool.ui.Button
        data-testid='loginButton'
        className={accountClasses.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('common.backToLogin')}
        onClick={handleClickSignIn}
      />
    </div>
  )
}

export default Reset
