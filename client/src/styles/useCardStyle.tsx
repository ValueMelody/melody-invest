import * as interfaces from '@shared/interfaces'
import * as vendorTool from 'tools/vendor'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  container: {
    margin: '1rem 0.75rem 1rem 0 !important',
  },
  isActive: {
    border: `3px solid ${theme.PrimaryColor} !important`,
  },
  disabled: {
    backgroundColor: `${theme.LightGray} !important`,
  },
}))

const useCardStyle = () => {
  const cardClasses = useStyles()

  return {
    cardClasses,
  }
}

export default useCardStyle
