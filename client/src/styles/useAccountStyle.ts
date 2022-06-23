import * as vendorTool from 'tools/vendor'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    height: '80vh',
    display: 'block',
    textAlign: 'center',
    overflowY: 'scroll',
    width: '80%',
    paddingLeft: '10%',
    marginLeft: '10%',
    minWidth: 360,
  },
  title: {
    marginBottom: '2rem !important',
  },
  row: {
    marginBottom: '2rem',
    width: '80%',
    marginLeft: '10%',
  },
  routerButton: {
    marginTop: '4rem !important',
  },
}))

const useAccountStyle = () => {
  const accountClasses = useStyles()

  return {
    accountClasses,
  }
}

export default useAccountStyle
