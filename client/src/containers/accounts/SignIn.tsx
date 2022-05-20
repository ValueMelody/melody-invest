import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import * as routerTool from '../../tools/router'
import RequiredLabel from '../elements/RequiredLabel'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import useAccountUI from './hooks/useAccountUI'
import usePublicGuard from '../hooks/usePublicGuard'

const useStyles = vendorTool.jss.createUseStyles(({
  forgotButton: {
    marginTop: '2rem !important',
  },
}))

const SignIn = () => {
  usePublicGuard()
  const navigate = vendorTool.router.useNavigate()
  const pageClasses = useStyles()

  // ------------------------------------------------------------ State --

  const { classes, getPasswordError } = useAccountUI()
  const { clearMessages, addMessage } = useCommonState()
  const { createUserToken } = useUserState()

  const [email, setEmail] = vendorTool.react.useState('')
  const [password, setPassword] = vendorTool.react.useState('')
  const [shouldRemember, setShouldRemember] = vendorTool.react.useState(false)

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
    clearMessages({ onlyErrors: true })
  }

  const handleChangePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value)
    clearMessages({ onlyErrors: true })
  }

  const handleToggleRemember = () => {
    setShouldRemember(!shouldRemember)
  }

  const handleClickSignUp = () => {
    navigate(routerTool.signUpRoute())
  }

  const handleClickForgot = () => {
    navigate(routerTool.forgotRoute())
  }

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const error = getPasswordError(parsedPassword)
    if (error) {
      addMessage({ id: Math.random(), type: 'error', title: error })
      return
    }
    await createUserToken(parsedEmail, parsedPassword, shouldRemember)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={vendorTool.classNames(classes.container, 'column-center')}>
      <h2 className={classes.title}>{localeTool.t('signIn.title')}</h2>
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
        <div className={vendorTool.classNames(classes.row, 'row-around')}>
          <vendorTool.ui.Checkbox
            label={localeTool.t('signIn.remember')}
            checked={shouldRemember}
            onChange={handleToggleRemember}
          />
        </div>
        <div className='row-around'>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            disabled={!email || !password}
          >
            {localeTool.t('signIn.button')}
          </vendorTool.ui.Button>
        </div>
      </form>
      <vendorTool.ui.Button
        className={classes.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signIn.toSignUp')}
        onClick={handleClickSignUp}
      />
      <vendorTool.ui.Button
        className={pageClasses.forgotButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signIn.toReset')}
        onClick={handleClickForgot}
      />
    </div>
  )
}

export default SignIn
