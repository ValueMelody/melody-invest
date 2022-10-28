import { useState, useMemo, ChangeEvent, FormEvent } from 'react'
import { TextInput, Button, Card } from 'flowbite-react'
import * as constants from '@shared/constants'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as commonEnum from 'enums/common'
import useUserRequest from 'requests/useUserRequest'
import useCommonState from 'states/useCommonState'
import useUserState from 'states/useUserState'
import usePasswordValidator from 'handlers/usePasswordValidator'
import usePrivateGuard from 'handlers/usePrivateGuard'
import RequiredLabel from 'containers/elements/RequiredLabel'
import ConfirmModal from 'containers/elements/ConfirmModal'
import SubscribeModal from 'containers/accounts/blocks/SubscribeModal'
import UnsubscribeButton from 'containers/accounts/blocks/UnsubscribeButton'

const cardClass = 'w-96 mb-6 mx-4'

const useStyles = createUseStyles(({
  input: {
    marginTop: '2rem !important',
    display: 'block !important',
  },
  planDate: {
    marginTop: '1rem !important',
  },
}))

const Setting = () => {
  usePrivateGuard()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { validatePassword } = usePasswordValidator()
  const { updateUserPassword, lockUserAccount } = useUserRequest()
  const { getUser, removeUser } = useUserState()
  const { addMessage } = useCommonState()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [showConfirmLock, setShowConfirmLock] = useState(false)

  const user = getUser()

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
      addMessage({ id: Math.random(), type: 'failure', title: error })
      return
    }
    updateUserPassword(parsedCurrentPassword, parsedNewPassword)
  }

  const handleSignOut = () => {
    removeUser()
  }

  const handleConfirmLock = () => {
    lockUserAccount()
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
        <h4>{localeTool.t('setting.lockAccessDesc')}</h4>
        <Button
          className={classes.input}
          onClick={handleConfirmLock}
        >
          {localeTool.t('common.confirm')}
        </Button>
      </ConfirmModal>
      <section className='flex flex-wrap w-full'>
        <Card className={cardClass}>
          <h3>{localeTool.t('setting.accountInfo')}</h3>
          <h4>{localeTool.t('common.email')}: {user.userEmail}</h4>
            <Button
              color='gray'
              className={classes.input}
              onClick={handleSignOut}
            >
              {localeTool.t('setting.signOut')}
            </Button>
            <Button
              color='gray'
              className={classes.input}
              onClick={handleToggleConfirmLock}
            >
              {localeTool.t('setting.lockAccess')}
            </Button>
        </Card>
        <Card className={cardClass}>
          <h3>{localeTool.t('setting.accountType')}</h3>
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
            <h5 className={classes.planDate}>
              {localeTool.t('setting.planStartAt', { date: user.planStartAtUTC })}
            </h5>
          )}
          {user.planEndAtUTC && (
            <h5 className={classes.planDate}>
              {localeTool.t('setting.planEndAt', { date: user.planEndAtUTC })}
            </h5>
          )}
          {user.userType === constants.User.Type.Basic && (
            <SubscribeModal />
          )}
        </Card>
        <Card className={cardClass}>
          <h3>{localeTool.t('setting.changePassword')}</h3>
          <form onSubmit={handleSubmit}>
            <RequiredLabel title={localeTool.t('common.currentPassword')} />
            <TextInput
              type='password'
              value={currentPassword}
              onChange={handleChangeCurrentPassword}
              className={classes.input}
            />
            <RequiredLabel title={localeTool.t('common.newPassword')} />
            <TextInput
              type='password'
              value={newPassword}
              onChange={handleChangeNewPassword}
              className={classes.input}
            />
            <RequiredLabel title={localeTool.t('common.retypePassword')} />
            <TextInput
              type='password'
              value={retypePassword}
              onChange={handleChangeRetypePassword}
              className={classes.input}
            />
            <Button
              type='submit'
              disabled={!currentPassword || !newPassword || !retypePassword}
              className={classes.input}
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
