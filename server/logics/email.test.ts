
import * as email from './email'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'

// @ts-ignore
const user: interfaces.userModel.Record = {
  id: 1,
  email: 'test@email.com',
  activationCode: 'abcdefg',
  resetCode: 'qwerty',
}

describe('#buildActivateUserEmail', () => {
  test('could build active user email', () => {
    const content = email.buildActivateUserEmail(user)
    expect(content).toContain('http://127.0.0.1:3099/activation/abcdefg')
    expect(content).toContain('test@email.com')
    expect(content).toContain(localeTool.getTranslation('email.activateUserTitle'))
    expect(content).not.toContain('qwerty')
  })
})

describe('#buildResetPasswordEmail', () => {
  test('could build reset password email', () => {
    const content = email.buildResetPasswordEmail(user)
    expect(content).toContain('http://127.0.0.1:3099/reset-password/qwerty')
    expect(content).toContain('test@email.com')
    expect(content).toContain(localeTool.getTranslation('email.resetPasswordTitle'))
    expect(content).not.toContain('abcdefg')
  })
})
