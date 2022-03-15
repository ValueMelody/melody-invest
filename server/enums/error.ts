export const DEFAULT = {
  FORBIDDEN: {
    code: 403,
    message: 'Forbidden',
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found',
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
  },
}

export const CUSTOM = {
  DB_CREATE_FAILED: { code: 500, message: 'Can not create record.' },
  DB_UPDATE_FAILED: { code: 500, message: 'Can not update record.' },
  FOREIGN_RECORD_MISSING: { code: 500, message: 'Foreign key relation missing.' },
  ACCESS_CODE_MISMATCH: { code: 404, message: 'Wrong access code.' },
  RECORD_NOT_FOUND: { code: 404, message: 'Item not found.' },
  PARAMS_MISSING: { code: 403, message: 'Missing parameters.' },
  PASSWORD_TOO_SHORT: { code: 403, message: 'Password is too short.' },
  EMAIL_TOO_LONG: { code: 403, message: 'Email is too long.' },
  EMAIL_WRONG_FORMAT: { code: 403, message: 'Email format required.' },
  USER_NOT_FOUND: { code: 404, message: 'Can not find user matches provided email and password' },
  USER_NOT_ACTIVATED: { code: 403, message: 'User not activated' },
}
