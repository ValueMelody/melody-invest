import { useNavigate } from 'react-router-dom'
import { useState, ChangeEvent, FormEvent } from 'react'
import { TextInput, Button } from 'flowbite-react'
import classNames from 'classnames'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import RequiredLabel from 'containers/elements/RequiredLabel'
import usePublicGuard from 'handlers/usePublicGuard'
import useAccountStyle from 'styles/useAccountStyle'
import useCommonStyle from 'styles/useCommonStyle'
import GoToButton from './elements/GoToButton'

const Forgot = () => {
  usePublicGuard()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { accountClasses } = useAccountStyle()
  const { commonClasses } = useCommonStyle()
  const { createResetEmail } = useUserRequest()

  const [email, setEmail] = useState('')

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
  }

  const handleClickSignIn = () => {
    navigate(routerTool.signInRoute())
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
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
        <div className={classNames(
          commonClasses.rowAround,
          accountClasses.row,
        )}>
          <RequiredLabel title={localeTool.t('common.email')} />
          <TextInput
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div className={commonClasses.rowAround}>

          <Button
            type='submit'
            disabled={!email}
          >
            {localeTool.t('forgot.button')}
          </Button>
        </div>
      </form>
      <footer className='mt-16 flex justify-center'>
        <GoToButton
          title={localeTool.t('signUp.toSignIn')}
          onClick={handleClickSignIn}
        />
      </footer>
    </div>
  )
}

export default Forgot
