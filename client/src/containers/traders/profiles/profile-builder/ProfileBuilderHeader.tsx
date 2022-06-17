import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = vendorTool.jss.createUseStyles({
  segmentHeader: {
    marginBottom: '1rem',
  },
  segmentTitle: {
    margin: '0 !important',
  },
  count: {
    marginLeft: '0.5rem !important',
    marginRight: '1rem !important',
  },
  invalidMessage: {
    color: 'red',
  },
})

const ProfileBuilderHeader = ({
  title,
  activeCount,
  isValid,
  invalidMessage,
  isExtended,
  onExtend,
}: {
  title: string;
  activeCount: number;
  isValid: boolean;
  invalidMessage: string;
  isExtended: boolean;
  onExtend: () => void;
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  // ------------------------------------------------------------ Handler --

  const handleToggleBuyBehaviors = () => {
    if (!onExtend) return
    onExtend()
  }

  // ------------------------------------------------------------ UI --

  return (
    <header
      onClick={handleToggleBuyBehaviors}
      className={vendorTool.classNames(
        commonClasses.rowStart,
        commonClasses.cursorClickable,
        { [classes.segmentHeader]: isExtended },
      )}
    >
      <h3 className={classes.segmentTitle}>
        {title}
      </h3>
      <vendorTool.ui.Icon
        size='large'
        color='blue'
        name={isExtended ? 'caret down' : 'caret right'}
      />
      <h5 className={classes.count}>
        {localeTool.t('common.numSelected', { num: activeCount })}
      </h5>
      {isValid && <vendorTool.ui.Icon name='checkmark' color='green' />}
      {!isValid && <h5 className={classes.invalidMessage}>* {invalidMessage}</h5>}
    </header>
  )
}

export default ProfileBuilderHeader
