export const Default = Object.freeze({
  Unauthorized: { code: 401, message: 'Unauthorized' },
  Forbidden: { code: 403, message: 'Forbidden' },
  NotFound: { code: 404, message: 'Not Found' },
  InternalServerError: { code: 500, message: 'Internal Server Error' },
})

export const Custom = Object.freeze({
  PayPalServerError: { code: 500, message: 'Can not connect to PayPal' },
  OrderNotFound: { code: 404, message: 'Can not find active order' },
  CreationFailed: { code: 500, message: 'Can not create record.' },
  UpdationFailed: { code: 500, message: 'Can not update record.' },
  RecordNotFound: { code: 500, message: 'Item not found.' },
  WrongAccessCode: { code: 404, message: 'Wrong access code.' },
  MissingParams: { code: 403, message: 'Missing parameters.' },
  SymbolTooLong: { code: 403, message: 'Symbol is too long.' },
  PasswordTooShort: { code: 403, message: 'Password is too short.' },
  EmailTooLong: { code: 403, message: 'Email is too long.' },
  EmailWrongFormat: { code: 403, message: 'Email format required.' },
  UserNotFound: { code: 404, message: 'Can not find user matches provided email and password' },
  UserNotActivated: { code: 403, message: 'User not activated' },
  OrderFailed: { code: 403, message: 'Unable to verify order status' },
})

export const Dev = Object.freeze({
  WrongMiddleware: { code: 500, message: 'Wrong middleware usage' },
})
