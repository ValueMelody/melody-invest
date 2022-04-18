import * as vendorTool from '../../tools/vendor'
import * as themeEnum from '../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  aside: {
    width: '26rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(100% - 30rem)',
    minWidth: '26rem',
  },
  activeCard: {
    border: `3px solid ${theme.PRIMARY_COLOR} !important`,
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
