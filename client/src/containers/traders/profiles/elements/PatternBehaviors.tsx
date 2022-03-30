import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as themeEnum from '../../../../enums/theme'
import BehaviorLabel from './BehaviorLabel'

const useStyles = createUseStyles({
  container: {
    marginTop: '1rem',
  },
})

const PatternBehaviors = ({
  pattern,
}: {
  pattern: interfaces.traderPatternModel.Public;
}) => {
  const classes = useStyles()

  const otherBehaviors: interfaces.traderPatternModel.Behavior[] = [
    ...constants.behavior.allocateBehaviors,
    ...constants.behavior.frequencyBehaviors,
    ...constants.behavior.preferenceBehaviors,
  ]

  const activeBuyBehaviors = constants.behavior.buyBehaviors.filter((key) => pattern[key] !== null)
  const activeSellBehaviors = constants.behavior.sellBehaviors.filter((key) => pattern[key] !== null)

  return (
    <div className={classNames('row-start', classes.container)}>
      {activeBuyBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color={themeEnum.theme.INCREASE_COLOR}
        />
      ))}
      {activeSellBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color={themeEnum.theme.DECREASE_COLOR}
        />
      ))}
      {otherBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color='grey'
        />
      ))}
    </div>
  )
}

export default PatternBehaviors
