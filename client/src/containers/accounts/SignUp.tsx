import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Button, Checkbox, Label, TextInput, Textarea } from 'flowbite-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GoToButton from './elements/GoToButton'
import RequiredLabel from 'containers/elements/RequiredLabel'
import { globalSlice } from 'stores/global'
import { useNavigate } from 'react-router-dom'
import usePasswordValidator from 'hooks/usePasswordValidator'
import usePublicGuard from 'hooks/usePublicGuard'

const SignUp = () => {
  usePublicGuard()

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

  const { validatePassword } = usePasswordValidator()

  const { termsPolicy } = useSelector(selectors.selectContent())

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!termsPolicy) dispatch(actions.fetchSystemPolicy(constants.Content.PolicyType.TermsAndConditions))
  }, [termsPolicy, dispatch])

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
      dispatch(globalSlice.actions.addMessage({
        title: error,
        type: 'failure',
      }))
      return
    }
    dispatch(actions.createUser({
      email: parsedEmail,
      password: parsedPassword,
      isConfirmed,
    })).then((res: any) => {
      if (!res.error) navigate(routerTool.signInRoute())
    })
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
            value={termsPolicy?.content || ''}
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
