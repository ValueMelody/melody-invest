import { useState, useMemo, ChangeEvent, FormEvent } from 'react'
import { TextInput, Button, Card } from 'flowbite-react'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as commonEnum from 'enums/common'
import usePasswordValidator from 'handlers/usePasswordValidator'
import usePrivateGuard from 'handlers/usePrivateGuard'
import RequiredLabel from 'containers/elements/RequiredLabel'
import ConfirmModal from 'containers/elements/ConfirmModal'
import SubscribeModal from 'containers/accounts/blocks/SubscribeModal'
import UnsubscribeButton from 'containers/accounts/blocks/UnsubscribeButton'
import { useSelector, useDispatch } from 'react-redux'
import * as selectors from 'selectors'
import * as actions from 'actions'
import { globalSlice } from 'stores/global'

const cardClass = 'w-96 mb-6 mx-4'
const titleClass = 'font-bold text-xl mb-4'

const Setting = () => {
  usePrivateGuard()

  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

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

  // ------------------------------------------------------------ Handler --

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

  // ------------------------------------------------------------ UI --

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
            color='gray'
            onClick={handleSignOut}
            className='mb-4'
          >
            {localeTool.t('setting.signOut')}
          </Button>
          <Button
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
          {user.userType !== constants.User.Type.Basic && !user.planEndAtUTC && (
            <UnsubscribeButton />
          )}
          {user.planStartAtUTC && (
            <h5>
              {localeTool.t('setting.planStartAt', { date: user.planStartAtUTC })}
            </h5>
          )}
          {user.planEndAtUTC && (
            <h5>
              {localeTool.t('setting.planEndAt', { date: user.planEndAtUTC })}
            </h5>
          )}
          <div className='mt-4'>
            {user.userType === constants.User.Type.Basic && (
              <SubscribeModal />
            )}
          </div>
        </Card>
        <Card className={cardClass}>
          <h2 className={titleClass}>
            {localeTool.t('setting.accountCredential')}
          </h2>
          <form onSubmit={handleSubmit}>
            <RequiredLabel
              className='mb-2'
              title={localeTool.t('common.currentPassword')}
            />
            <TextInput
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
              className='mb-4'
              type='password'
              value={retypePassword}
              onChange={handleChangeRetypePassword}
            />
            <Button
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
