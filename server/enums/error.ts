export const Default = Object.freeze({
  Unauthorized: { code: 401, message: 'Unauthorized' },
  Forbidden: { code: 403, message: 'Forbidden' },
  NotFound: { code: 404, message: 'Not Found' },
  InternalServerError: { code: 500, message: 'Internal Server Error' },
})

export const Custom = Object.freeze({
  PayPalServerError: { code: 500, message: 'Can not connect to PayPal' },
  SubscriptionNotFound: { code: 404, message: 'Can not find active subscription' },
  CreationFailed: { code: 500, message: 'Can not create record.' },
  UpdationFailed: { code: 500, message: 'Can not update record.' },
  RecordNotFound: { code: 500, message: 'Item not found.' },
  WrongAccessCode: { code: 404, message: 'Wrong access code.' },
  MissingParams: { code: 403, message: 'Missing parameters.' },
  PasswordTooShort: { code: 403, message: 'Password is too short.' },
  EmailTooLong: { code: 403, message: 'Email is too long.' },
  EmailWrongFormat: { code: 403, message: 'Email format required.' },
  UserNotFound: { code: 404, message: 'Can not find user matches provided email and password' },
  UserNotActivated: { code: 403, message: 'User not activated' },
  SubscriptionFailed: { code: 403, message: 'Unable to verify subscription status' },
})
