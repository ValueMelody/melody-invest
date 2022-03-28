import { createUseStyles } from 'react-jss'
import PasswordValidator from 'password-validator'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles(({
  container: {
    height: '80vh',
  },
  title: {
    marginBottom: '2rem',
  },
  row: {
    width: 360,
    marginBottom: '2rem',
  },
}))

const useAccountInterface = () => {
  const classes = useStyles()

  const passwordSchema = new PasswordValidator()
  passwordSchema
    .has().min(10, localeTool.t('error.password.requireMin', { num: 10 }))
    .has().uppercase(1, localeTool.t('error.password.requireUpper'))
    .has().lowercase(1, localeTool.t('error.password.requireLower'))
    .has().symbols(1, localeTool.t('error.password.requireSymbol'))

  const getPasswordError = (password: string): string => {
    const errors = passwordSchema.validate(password, { list: true, details: true })
    const error = Array.isArray(errors) && errors.length ? errors[0].message : ''
    return error
  }

  return {
    classes,
    getPasswordError,
  }
}

export default useAccountInterface
