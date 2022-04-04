import { MouseEvent } from 'react'
import { Label, SemanticCOLORS } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as parseTool from '../../../tools/parse'
import classNames from 'classnames'

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
  const classes = useStyles()

  // ------------------------------------------------------------ State --

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

  // ------------------------------------------------------------ Interface --

  return (
    <Label
      className={classNames(classes.container, {
        'info-cursor': !onClick,
        'click-cursor': !!onClick,
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
