import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'

const usePasswordValidator = () => {
  const passwordSchema = new vendorTool.PasswordValidator()
  passwordSchema
    .has().min(10, localeTool.t('error.password.requireMin', { num: 10 }))
    .has().uppercase(1, localeTool.t('error.password.requireUpper'))
    .has().lowercase(1, localeTool.t('error.password.requireLower'))
    .has().symbols(1, localeTool.t('error.password.requireSymbol'))

  const validatePassword = (password: string): string => {
    const errors = passwordSchema.validate(password, { list: true, details: true })
    const error = Array.isArray(errors) && errors.length ? errors[0].message : ''
    return error
  }

  return {
    validatePassword,
  }
}

export default usePasswordValidator
