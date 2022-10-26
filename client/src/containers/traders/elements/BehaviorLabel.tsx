import { MouseEvent } from 'react'
import classNames from 'classnames'
import { Label, SemanticCOLORS } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import { createUseStyles } from 'react-jss'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles({
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
  color: SemanticCOLORS;
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

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (!onClick) return
    onClick(behavior)
  }

  // ------------------------------------------------------------ UI --

  return (
    <Label
      data-testid='behaviorLabel'
      className={classNames(classes.container, {
        [commonClasses.cursorInfo]: !onClick,
        [commonClasses.cursorClickable]: !!onClick,
      })}
      color={color}
      title={behaviorDesc}
      onClick={handleClick}
    >
      {hasValue ? `${behaviorTitle}: ${behaviorValue}` : behaviorTitle}
    </Label>
  )
}

export default BehaviorLabel
