import * as vendorTool from '../../tools/vendor'
import * as localeTool from '../../tools/locale'
import * as routerTool from '../../tools/router'
import RequiredLabel from '../elements/RequiredLabel'
import useCommonState from '../../states/useCommonState'
import useUserState from '../../states/useUserState'
import useAccountInterface from './hooks/useAccountInterface'
import usePublicGuard from '../hooks/usePublicGuard'

const SignIn = () => {
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  usePublicGuard()

  const { classes, getPasswordError } = useAccountInterface()
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
    clearMessages()
  }

  const handleChangePassword = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value)
    clearMessages()
  }

  const handleToggleRemember = () => {
    setShouldRemember(!shouldRemember)
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
      .then(() => navigate(routerTool.dashboardRoute()))
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
        <div className={classes.row}>
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
    </div>
  )
}

export default SignIn
