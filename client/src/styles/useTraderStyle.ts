import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(({
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
}))

const useTraderStyle = () => {
  const traderClasses = useStyles()

  return {
    traderClasses,
  }
}

export default useTraderStyle
