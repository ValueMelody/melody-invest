import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { Button, Card, TextInput } from 'flowbite-react'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmModal from 'containers/elements/ConfirmModal'
import PaymentModal from 'containers/accounts/blocks/PaymentModal'
import RequiredLabel from 'containers/elements/RequiredLabel'
import { globalSlice } from 'stores/global'
import usePasswordValidator from 'hooks/usePasswordValidator'
import usePrivateGuard from 'hooks/usePrivateGuard'

const cardClass = 'w-96 mb-6 mx-4'
const titleClass = 'font-bold text-xl mb-4'

const Setting = () => {
  usePrivateGuard()

  const dispatch = useDispatch<AppDispatch>()

  const { validatePassword } = usePasswordValidator()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [showConfirmLock, setShowConfirmLock] = useState(false)

  const user = useSelector(selectors.selectUser())

  const userTypeText = useMemo(() => {
    switch (user.userType) {
      case constants.User.Type.Premium:
        return commonEnum.Plan.Premium
      case constants.User.Type.Pro:
        return commonEnum.Plan.Pro
      case constants.User.Type.Basic:
      default:
        return commonEnum.Plan.Basic
    }
  }, [user.userType])

  const handleChangeCurrentPassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setCurrentPassword(e.target.value)
  }

  const handleChangeNewPassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(e.target.value)
  }

  const handleChangeRetypePassword = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setRetypePassword(e.target.value)
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    const parsedCurrentPassword = currentPassword.trim()
    const parsedNewPassword = newPassword.trim()
    const parsedRetypePasswod = retypePassword.trim()

    const formatError = validatePassword(parsedCurrentPassword) || validatePassword(parsedNewPassword)
    const error = parsedNewPassword !== parsedRetypePasswod
      ? localeTool.t('error.password.requireSame')
      : formatError

    if (error) {
      dispatch(globalSlice.actions.addMessage({
        title: error,
        type: 'failure',
      }))
      return
    }
    dispatch(actions.updateUserPassword({
      currentPassword: parsedCurrentPassword,
      newPassword: parsedNewPassword,
    }))
  }

  const handleSignOut = () => {
    dispatch(actions.logout())
  }

  const handleConfirmLock = () => {
    dispatch(actions.lockUserAccount())
  }

  const handleToggleConfirmLock = () => {
    setShowConfirmLock(!showConfirmLock)
  }

  return (
    <div>
      <ConfirmModal
        title={localeTool.t('setting.lockAccess')}
        isOpen={showConfirmLock}
        onClose={handleToggleConfirmLock}
      >
        <h4>
          {localeTool.t('setting.lockAccessDesc')}
        </h4>
        <Button
          onClick={handleConfirmLock}
          className='mt-4'
        >
          {localeTool.t('common.confirm')}
        </Button>
      </ConfirmModal>
      <section className='flex flex-wrap w-full'>
        <Card className={cardClass}>
          <h2 className={titleClass}>
            {localeTool.t('setting.accountInfo')}
          </h2>
          <h4 className='mb-4'>
            {localeTool.t('common.email')}: {user.userEmail}
          </h4>
          <Button
            data-testid='signOutBtn'
            color='gray'
            onClick={handleSignOut}
            className='mb-4'
          >
            {localeTool.t('setting.signOut')}
          </Button>
          <Button
            data-testid='lockAccessBtn'
            color='gray'
            onClick={handleToggleConfirmLock}
          >
            {localeTool.t('setting.lockAccess')}
          </Button>
        </Card>
        <Card className={cardClass}>
          <h2 className={titleClass}>
            {localeTool.t('setting.accountType')}
          </h2>
          <h4>
            {`${userTypeText.Title} ${localeTool.t('common.plan')} - ${userTypeText.Price}`}
          </h4>
          {userTypeText.Services.map((service) => (
            <h5 key={service}>- {service}</h5>
          ))}
          {user.planEndAtUTC && (
            <h5>
              {localeTool.t('setting.planEndAt', { date: user.planEndAtUTC })}
            </h5>
          )}
          <div className='mt-4'>
            <PaymentModal
              userType={user.userType}
            />
          </div>
        </Card>
        <Card className={cardClass}>
          <h2 className={titleClass}>
            {localeTool.t('setting.accountCredential')}
          </h2>
          <form
            data-testid='form'
            onSubmit={handleSubmit}
          >
            <RequiredLabel
              className='mb-2'
              title={localeTool.t('common.currentPassword')}
            />
            <TextInput
              data-testid='password'
              className='mb-4'
              type='password'
              value={currentPassword}
              onChange={handleChangeCurrentPassword}
            />
            <RequiredLabel
              className='mb-2'
              title={localeTool.t('common.newPassword')}
            />
            <TextInput
              data-testid='newPassword'
              className='mb-4'
              type='password'
              value={newPassword}
              onChange={handleChangeNewPassword}
            />
            <RequiredLabel
              className='mb-2'
              title={localeTool.t('common.retypePassword')}
            />
            <TextInput
              data-testid='retypePassword'
              className='mb-4'
              type='password'
              value={retypePassword}
              onChange={handleChangeRetypePassword}
            />
            <Button
              data-testid='changePasswordBtn'
              type='submit'
              disabled={!currentPassword || !newPassword || !retypePassword}
            >
              {localeTool.t('setting.changePassword')}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  )
}

export default Setting
