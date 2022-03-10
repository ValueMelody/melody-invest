import { useMemo } from 'react'
import { Label, SemanticCOLORS } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../tools/locale'
import * as parseTool from '../tools/parse'
import classNames from 'classnames'

const BehaviorLabel = ({
  pattern,
  type,
  color,
  className,
  onClick,
}: {
  pattern: interfaces.traderPatternModel.Record;
  type: interfaces.traderPatternModel.BehaviorType;
  color: SemanticCOLORS;
  className: string;
  onClick?: Function;
}) => {
  const localeKey = `behavior.${type}`

  const handleClick = () => {
    if (!onClick) return
    onClick(type, pattern)
  }

  const value = useMemo(() => {
    const rawValue = pattern[type]
    if (type.includes('Percent')) return parseTool.dbPercent(rawValue)
    if (type.includes('Frequency')) return parseTool.patternFrequency(rawValue)
    if (type.includes('Preference')) return parseTool.patternPreference(rawValue)
    return rawValue
  }, [type, pattern])

  return (
    <Label
      className={classNames(className, {
        'info-cursor': !onClick,
        'click-cursor': !!onClick,
      })}
      color={color}
      title={localeTool.t(localeKey)}
      onClick={handleClick}
    >
      {type}: {value}
    </Label>
  )
}

export default BehaviorLabel
