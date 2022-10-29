import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { TextInput, Button, Textarea, Checkbox, Label } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import useSystemRequest from 'requests/useSystemRequest'
import useCommonState from 'states/useCommonState'
import useResourceState from 'states/useResourceState'
import usePublicGuard from 'handlers/usePublicGuard'
import usePasswordValidator from 'handlers/usePasswordValidator'
import RequiredLabel from 'containers/elements/RequiredLabel'
import GoToButton from './elements/GoToButton'

const SignUp = () => {
  usePublicGuard()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { validatePassword } = usePasswordValidator()
  const { addMessage } = useCommonState()
  const { createUser } = useUserRequest()
  const { fetchSystemPolicy } = useSystemRequest()
  const { getPolicy } = useResourceState()
  const policy = getPolicy()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!policy.termsPolicy) fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    // eslint-disable-next-line
  }, [policy.termsPolicy])

  // ------------------------------------------------------------ Handler --

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value)
  }

  const handleChangeRetypePassword = (
    e: ChangeEvent<HTMLInputElement>,
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
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const parsedEmail = email.trim().toLowerCase()
    const parsedPassword = password.trim()
    const parsedRetypePasswod = retypePassword.trim()
    const error = parsedPassword !== parsedRetypePasswod
      ? localeTool.t('error.password.requireSame')
      : validatePassword(parsedPassword)
    if (error) {
      addMessage({ id: Math.random(), type: 'failure', title: error })
      return
    }
    await createUser(parsedEmail, parsedPassword, isConfirmed)
  }

  // ------------------------------------------------------------ UI --

  return (
    <section className='account-root'>
      <h1 className='account-title'>
        {localeTool.t('signUp.title')}
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
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.password')}
          />
          <TextInput
            className='account-right'
            type='password'
            value={password}
            onChange={handleChangePassword}
          />
        </section>
        <section className='account-row'>
          <RequiredLabel
            className='account-left'
            title={localeTool.t('common.retypePassword')}
          />
          <TextInput
            className='account-right'
            type='password'
            value={retypePassword}
            onChange={handleChangeRetypePassword}
          />
        </section>
        <section className='account-row'>
          <Textarea
            className='h-60'
            disabled
            value={policy.termsPolicy || ''}
          />
        </section>
        <div className='flex justify-center items-center mb-4'>
          <Checkbox
            data-testid='checkbox'
            className='mr-2'
            checked={isConfirmed}
            onChange={handleToggleTerms}
          />
          <Label>
            {localeTool.t('signUp.terms')}
          </Label>
        </div>
        <div className='flex flex-col items-center'>
          <Button
            data-testid='signUpButton'
            type='submit'
            disabled={!email || !password || !retypePassword || !isConfirmed}
          >
            {localeTool.t('common.signUp')}
          </Button>
        </div>
      </form>
      <footer className='account-footer'>
        <GoToButton
          data-testid='signInButton'
          title={localeTool.t('signUp.toSignIn')}
          onClick={handleClickSignIn}
        />
      </footer>
    </section>
  )
}

export default SignUp
