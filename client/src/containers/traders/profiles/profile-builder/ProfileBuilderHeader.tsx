import * as vendorTool from '../../../../tools/vendor'
import * as localeTool from '../../../../tools/locale'

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
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleToggleBuyBehaviors = () => {
    if (!onExtend) return
    onExtend()
  }

  // ------------------------------------------------------------ Interface --

  return (
    <header
      onClick={handleToggleBuyBehaviors}
      className={vendorTool.classNames('row-start', 'click-cursor', {
        [classes.segmentHeader]: isExtended,
      })}
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
