import * as error from './error'

describe('#Default', () => {
  test('Have defined default error enums', () => {
    expect(error.Default.Unauthorized).toBeDefined()
    expect(error.Default.Forbidden).toBeDefined()
    expect(error.Default.NotFound).toBeDefined()
    expect(error.Default.InternalServerError).toBeDefined()
  })
})

describe('#Custom', () => {
  test('Have defined custom error enums', () => {
    expect(error.Custom.PayPalServerError).toBeDefined()
    expect(error.Custom.SubscriptionNotFound).toBeDefined()
    expect(error.Custom.CreationFailed).toBeDefined()
    expect(error.Custom.UpdationFailed).toBeDefined()
    expect(error.Custom.RecordNotFound).toBeDefined()
    expect(error.Custom.WrongAccessCode).toBeDefined()
    expect(error.Custom.MissingParams).toBeDefined()
    expect(error.Custom.PasswordTooShort).toBeDefined()
    expect(error.Custom.EmailTooLong).toBeDefined()
    expect(error.Custom.EmailWrongFormat).toBeDefined()
    expect(error.Custom.UserNotFound).toBeDefined()
    expect(error.Custom.UserNotActivated).toBeDefined()
  })
})

describe('#Dev', () => {
  test('Have defined dev enums', () => {
    expect(error.Dev.WrongMiddleware).toBeDefined()
  })
})
