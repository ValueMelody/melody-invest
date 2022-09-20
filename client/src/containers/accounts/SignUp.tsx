import * as constants from '@shared/constants'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import useSystemRequest from 'requests/useSystemRequest'
import useCommonState from 'states/useCommonState'
import useResourceState from 'states/useResourceState'
import usePublicGuard from 'handlers/usePublicGuard'
import usePasswordValidator from 'handlers/usePasswordValidator'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import RequiredLabel from 'containers/elements/RequiredLabel'

const useStyles = vendorTool.jss.createUseStyles(({
  policy: {
    padding: '1rem',
    height: 280,
    width: '100%',
  },
}))

const SignUp = () => {
  usePublicGuard()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()

  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { createUser } = useUserRequest()
  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  const [email, setEmail] = vendorTool.react.useState('')
  const [password, setPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')
  const [isConfirmed, setIsConfirmed] = vendorTool.react.useState(false)

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!policy.termsPolicy) fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
  }, [policy.termsPolicy])

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

  const handleToggleTerms = () => {
    setIsConfirmed(!isConfirmed)
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
    await createUser(parsedEmail, parsedPassword, isConfirmed)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('signUp.title')}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={vendorTool.classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <vendorTool.ui.Input
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={vendorTool.classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.password')} />
          <vendorTool.ui.Input
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
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={accountClasses.row}>
          <vendorTool.ui.TextArea
            className={classes.policy}
            disabled
            value={policy.termsPolicy || ''}
          />
        </div>
        <div className={accountClasses.row}>
          <vendorTool.ui.Checkbox
            label={localeTool.t('signUp.terms')}
            checked={isConfirmed}
            onChange={handleToggleTerms}
          />
        </div>
        <div className={commonClasses.rowAround}>
          <vendorTool.ui.Button
            data-testid='signUpButton'
            type='submit'
            color='blue'
            disabled={!email || !password || !retypePassword || !isConfirmed}
          >
            {localeTool.t('common.signUp')}
          </vendorTool.ui.Button>
        </div>
      </form>
      <vendorTool.ui.Button
        data-testid='signInButton'
        className={accountClasses.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signUp.toSignIn')}
        onClick={handleClickSignIn}
      />
    </div>
  )
}

export default SignUp
