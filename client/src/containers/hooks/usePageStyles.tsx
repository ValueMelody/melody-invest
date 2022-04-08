import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    alignItems: 'center',
    width: 'calc(100% - 28rem)',
    minWidth: '26rem',
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
