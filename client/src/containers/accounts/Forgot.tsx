import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import RequiredLabel from 'containers/elements/RequiredLabel'
import usePublicGuard from 'handlers/usePublicGuard'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'

const Forgot = () => {
  usePublicGuard()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { createResetEmail } = useUserRequest()

  const [email, setEmail] = vendorTool.react.useState('')

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: vendorTool.react.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
  }

  const handleClickSignIn = () => {
    navigate(routerTool.signInRoute())
  }

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    await createResetEmail(parsedEmail)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={accountClasses.container}>
      <h2 className={accountClasses.title}>
        {localeTool.t('forgot.title')}
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
        <div className={commonClasses.rowAround}>
          <vendorTool.ui.Button
            type='submit'
            color='blue'
            disabled={!email}
          >
            {localeTool.t('forgot.button')}
          </vendorTool.ui.Button>
        </div>
      </form>
      <vendorTool.ui.Button
        className={accountClasses.routerButton}
        icon='right arrow'
        labelPosition='right'
        content={localeTool.t('signUp.toSignIn')}
        onClick={handleClickSignIn}
      />
    </div>
  )
}

export default Forgot
