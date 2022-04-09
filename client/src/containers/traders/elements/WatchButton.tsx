import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'

const useStyles = vendorTool.jss.createUseStyles(({
  action: {
    marginTop: '0.5rem !important',
    marginRight: '0.5rem !important',
    padding: '0.5rem 1rem !important',
  },
}))

const WatchButton = ({
  isWatched,
  onToggle,
}: {
  isWatched: boolean;
  onToggle: () => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleToggle = (e: vendorTool.react.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  // ------------------------------------------------------------ Interface --

  return (
    <vendorTool.ui.Button
      className={classes.action}
      onClick={handleToggle}
    >
      <vendorTool.ui.Icon name='eye' />
      {localeTool.t(isWatched ? 'common.unwatch' : 'common.watch')}
    </vendorTool.ui.Button>
  )
}

export default WatchButton
