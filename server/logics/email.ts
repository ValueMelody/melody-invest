import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as generateTool from 'tools/generate'
import * as emailEnum from 'enums/email'
import * as adapterEnum from 'enums/adapter'

export const buildActivateUserEmail = (
  user: interfaces.userModel.Record,
): string => {
  const base = `${adapterEnum.HostConfig.ClientType}://${adapterEnum.HostConfig.ClientHost}`
  const link = `${base}/activation/${user.activationCode}`
  const options = [
    { label: 'title', value: localeTool.getTranslation('email.activateUserTitle') },
    { label: 'content', value: localeTool.getTranslation('email.activateUserContent') },
    { label: 'desc', value: localeTool.getTranslation('email.activateUserDesc') },
    { label: 'link', value: link },
    { label: 'buttonTitle', value: `${localeTool.getTranslation('email.activateUserButton')}: ${user.email}` },
  ]
  const content = generateTool.buildEmailContent(
    emailEnum.Type.UserActivation, options,
  )
  return content
}

export const buildResetPasswordEmail = (
  user: interfaces.userModel.Record,
): string => {
  const base = `${adapterEnum.HostConfig.ClientType}://${adapterEnum.HostConfig.ClientHost}`
  const link = `${base}/reset-password/${user.resetCode}`
  const options = [
    { label: 'title', value: localeTool.getTranslation('email.resetPasswordTitle') },
    { label: 'content', value: localeTool.getTranslation('email.resetPasswordContent') },
    { label: 'desc', value: localeTool.getTranslation('email.resetPasswordDesc') },
    { label: 'link', value: link },
    { label: 'buttonTitle', value: `${localeTool.getTranslation('email.resetPasswordButton')}: ${user.email}` },
  ]
  const content = generateTool.buildEmailContent(
    emailEnum.Type.PasswordReset, options,
  )
  return content
}
