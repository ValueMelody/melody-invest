import { useNavigate } from 'react-router-dom'
import { useState, ChangeEvent, FormEvent } from 'react'
import { TextInput, Button } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as actions from 'actions'
import RequiredLabel from 'containers/elements/RequiredLabel'
import usePublicGuard from 'handlers/usePublicGuard'
import GoToButton from './elements/GoToButton'

const Forgot = () => {
  usePublicGuard()

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

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

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    dispatch(actions.createResetEmail(parsedEmail))
      .then((res: any) => {
        if (!res.error) navigate(routerTool.signInRoute())
      })
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='account-root'>
      <h1 className='account-title'>
        {localeTool.t('forgot.title')}
      </h1>
      <form onSubmit={handleSubmit}>
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.email')}
          />
          <TextInput
            className='account-right'
            type='email'
            value={email}
            onChange={handleChangeEmail}
          />
        </section>
        <div className='flex flex-col items-center'>
          <Button
            type='submit'
            disabled={!email}
          >
            {localeTool.t('forgot.button')}
          </Button>
        </div>
      </form>
      <footer className='account-footer'>
        <GoToButton
          title={localeTool.t('signUp.toSignIn')}
          onClick={handleClickSignIn}
        />
      </footer>
    </section>
  )
}

export default Forgot
