import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../tools/vendor'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  aside: {
    width: '24rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(100% - 28rem)',
    minWidth: '24rem',
  },
  activeCard: {
    border: `3px solid ${theme.PrimaryColor} !important`,
  },
}))

const usePageStyles = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ export --

  return {
    classes,
  }
}

export default usePageStyles
