import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as vendorTool from 'tools/vendor'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = vendorTool.jss.createUseStyles({
  container: {
    margin: '0.25rem 0.125rem !important',
  },
})

const BehaviorLabel = ({
  behavior,
  value,
  color,
  onClick,
}: {
  behavior: interfaces.traderPatternModel.Behavior;
  color: vendorTool.ui.SemanticCOLORS;
  value?: number | null;
  onClick?: (behavior: interfaces.traderPatternModel.Behavior) => void;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const behaviorTitle = parseTool.behaviorTitle(behavior)
  const behaviorDesc = parseTool.behaviorDesc(behavior)
  const hasValue = value !== null && value !== undefined
  const behaviorValue = hasValue ? parseTool.behaviorValue(behavior, value) : null

  // ------------------------------------------------------------ Handler --

  const handleClick = (e: vendorTool.react.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (!onClick) return
    onClick(behavior)
  }

  // ------------------------------------------------------------ UI --

  return (
    <vendorTool.ui.Label
      data-testid='behaviorLabel'
      className={vendorTool.classNames(classes.container, {
        [commonClasses.cursorInfo]: !onClick,
        [commonClasses.cursorClickable]: !!onClick,
      })}
      color={color}
      title={behaviorDesc}
      onClick={handleClick}
    >
      {hasValue ? `${behaviorTitle}: ${behaviorValue}` : behaviorTitle}
    </vendorTool.ui.Label>
  )
}

export default BehaviorLabel
