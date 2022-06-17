import * as vendorTool from 'tools/vendor'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    height: '80vh',
  },
  title: {
    marginBottom: '2rem !important',
  },
  row: {
    width: 360,
    marginBottom: '2rem',
  },
  routerButton: {
    marginTop: '6rem !important',
  },
}))

const useAccountStyle = () => {
  const accountClasses = useStyles()

  return {
    accountClasses,
  }
}

export default useAccountStyle
