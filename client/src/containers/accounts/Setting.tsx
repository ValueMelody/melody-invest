import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { Button, Card, Label, Radio, TextInput } from 'flowbite-react'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmModal from 'containers/elements/ConfirmModal'
import RequiredLabel from 'containers/elements/RequiredLabel'
import { globalSlice } from 'stores/global'
import usePasswordValidator from 'hooks/usePasswordValidator'
import usePrivateGuard from 'hooks/usePrivateGuard'

const cardClass = 'w-96 mb-6 mx-4'
const titleClass = 'font-bold text-xl'

const Setting = () => {
  usePrivateGuard()

  const dispatch = useDispatch<AppDispatch>()

  const { validatePassword } = usePasswordValidator()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [showConfirmLock, setShowConfirmLock] = useState(false)
  const [targetSource, setTargetSource] = useState('')
  const [targetKey, setTargetKey] = useState('')

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

  useEffect(() => {
    if (!user.userEntity) {
      dispatch(actions.fetchUserEntity())
    }
  }, [user.userEntity, dispatch])

  useEffect(() => {
    if (user.userEntity) {
      setTargetSource(user.userEntity.dataSource || '')
      setTargetKey(user.userEntity.dataKey || '')
    }
  }, [user.userEntity])

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

  const handleClickSource = (e: ChangeEvent<HTMLInputElement>) => {
    const source = e.target.value
    setTargetSource(source)
    if (source === user.userEntity?.dataSource) {
      const key = user.userEntity.dataKey || ''
      setTargetKey(key)
    } else {
      setTargetKey('')
    }
  }

  const handleUpdateKey = (e: ChangeEvent<HTMLInputElement>) => {
    setTargetKey(e.target.value)
  }

  const handleSaveDataKey = () => {
    dispatch(actions.updateUserEntity({
      dataSource: targetSource,
      dataKey: targetKey,
    }))
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
          data-testid='confirmLockBtn'
          onClick={handleConfirmLock}
          className='mt-4'
        >
          {localeTool.t('setting.confirm')}
        </Button>
      </ConfirmModal>
      <section className='flex flex-wrap w-full'>
        <Card className={cardClass}>
          <h2 className={titleClass}>
            {localeTool.t('setting.accountInfo')}
          </h2>
          <h4 className='mb-4'>
            {localeTool.t('account.email')}: {user.userEmail}
          </h4>
          <section className='flex'>
            {(Object.values(constants.Entity.DataSource) as string[]).map((source) => (
              <div
                key={source}
                className='flex items-center mr-6'
              >
                <Radio
                  className='mr-2'
                  name='dataSource'
                  id={source}
                  value={source}
                  checked={source === targetSource}
                  onChange={handleClickSource}
                />
                <Label htmlFor={source}>
                  {source}
                </Label>
              </div>
            ))}
          </section>
          {targetSource && (
            <section className='flex justify-between'>
              <TextInput
                placeholder={localeTool.t('setting.dataKeyPlaceholder')}
                value={targetKey}
                onChange={handleUpdateKey}
              />
              <Button
                disabled={!targetKey.trim().length}
                onClick={handleSaveDataKey}
              >
                {localeTool.t('setting.saveDataKeyBtn')}
              </Button>
            </section>
          )}
          {targetSource === user.userEntity?.dataSource && user.userEntity?.isValidKey === false && (
            <p className='text-red-600'>{localeTool.t('setting.invalidDateKey')}</p>
          )}
          <Button
            data-testid='signOutBtn'
            color='gray'
            onClick={handleSignOut}
            className='mb-2 mt-4'
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
          <h4 data-testid='userPlan'>
            {`${userTypeText.Title} ${localeTool.t('plan.title')}`}
          </h4>
          {userTypeText.Services.map((service) => (
            <h5 key={service}>- {service}</h5>
          ))}
          {user.planEndAtUTC && (
            <h5>
              {localeTool.t('setting.planEndAt', { date: user.planEndAtUTC })}
            </h5>
          )}
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
              title={localeTool.t('setting.currentPassword')}
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
              title={localeTool.t('account.newPassword')}
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
              title={localeTool.t('account.retypePassword')}
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
