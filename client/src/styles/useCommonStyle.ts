import * as vendorTool from 'tools/vendor'

const useStyles = vendorTool.jss.createUseStyles(({
  rowBetween: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowStart: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnStart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cursorInfo: {
    cursor: 'help',
  },
  cursorClickable: {
    cursor: 'pointer',
  },
}))

const useCommonStyle = () => {
  const commonClasses = useStyles()

  return {
    commonClasses,
  }
}

export default useCommonStyle
