import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import * as routerTool from '../../tools/router'
import useUserRequest from '../../requests/useUserRequest'
import useCommonState from '../../states/useCommonState'
import useAccountUI from './hooks/useAccountUI'
import RequiredLabel from '../elements/RequiredLabel'
import usePublicGuard from '../hooks/usePublicGuard'

const SignUp = () => {
  usePublicGuard()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { classes, getPasswordError } = useAccountUI()
  const { addMessage } = useCommonState()
  const { createUser } = useUserRequest()

  const [email, setEmail] = vendorTool.react.useState('')
  const [password, setPassword] = vendorTool.react.useState('')
  const [retypePassword, setRetypePassword] = vendorTool.react.useState('')
  const [isConfirmed, setIsConfirmed] = vendorTool.react.useState(false)

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
      : getPasswordError(parsedPassword)
    if (error) {
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await createUser(parsedEmail, parsedPassword, isConfirmed)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={vendorTool.classNames(classes.container, 'column-center')}>
      <h2 className={classes.title}>{localeTool.t('signUp.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className={vendorTool.classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <vendorTool.ui.Input
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={vendorTool.classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.password')} />
          <vendorTool.ui.Input
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div className={vendorTool.classNames('row-between', classes.row)}>
          <RequiredLabel title={localeTool.t('common.retypePassword')} />
          <vendorTool.ui.Input
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </div>
        <div className={classes.row}>
          <vendorTool.ui.Checkbox
            label={localeTool.t('signUp.terms')}
            checked={isConfirmed}
            onChange={handleToggleTerms}
          />
        </div>
        <div className='row-around'>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            disabled={!email || !password || !retypePassword || !isConfirmed}
          >
            {localeTool.t('common.signUp')}
          </vendorTool.ui.Button>
        </div>
      </form>
      <vendorTool.ui.Button
        className={classes.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signUp.toSignIn')}
        onClick={handleClickSignIn}
      />
    </div>
  )
}

export default SignUp
