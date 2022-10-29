import { MouseEvent } from 'react'
import classNames from 'classnames'
import { Badge } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'

const BehaviorLabel = ({
  behavior,
  value,
  color,
  className,
  onClick,
}: {
  behavior: interfaces.traderPatternModel.Behavior;
  color: 'info' | 'gray' | 'indigo' | 'success' | 'failure';
  value?: number | null;
  className?: string;
  onClick?: (behavior: interfaces.traderPatternModel.Behavior) => void;
}) => {
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

  // ------------------------------------------------------------ UI --

  return (
    <Badge
      data-testid='behaviorLabel'
      size='sm'
      className={classNames(className, {
        'cursor-info': !onClick,
        'cursor-pointer': !!onClick,
      })}
      color={color}
      title={behaviorDesc}
      onClick={handleClick}
    >
      {hasValue ? `${behaviorTitle}: ${behaviorValue}` : behaviorTitle}
    </Badge>
  )
}

export default BehaviorLabel
