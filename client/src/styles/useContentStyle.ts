import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(({
  pageTitle: {
    marginBottom: '1rem !important',
    textAlign: 'center',
  },
  contentTextarea: {
    width: '100%',
    height: 'calc(100vh - 180px)',
    padding: '2rem',
  },
}))

const useContentStyle = () => {
  const contentClasses = useStyles()

  return {
    contentClasses,
  }
}

export default useContentStyle
