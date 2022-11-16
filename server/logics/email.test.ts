
import * as email from './email'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import { mock, instance, when } from 'ts-mockito'

const userMock: interfaces.userModel.Record = mock({})
when(userMock.id).thenReturn(1)
when(userMock.email).thenReturn('test@email.com')
when(userMock.activationCode).thenReturn('abcdefg')
when(userMock.resetCode).thenReturn('qwerty')
const user = instance(userMock)

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
