import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import { useNavigate } from 'react-router-dom'
import * as themeEnum from '../../../enums/theme'
import * as routerEnum from '../../../enums/router'
import BehaviorLabel from './BehaviorLabel'

const useStyles = createUseStyles({
  container: {
    marginTop: '1rem',
  },
})

const PatternBehaviors = ({
  pattern,
  envId,
}: {
  pattern: interfaces.traderPatternModel.Public;
  envId: number;
}) => {
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const otherBehaviors: interfaces.traderPatternModel.Behavior[] = [
    ...constants.behavior.allocateBehaviors,
    ...constants.behavior.frequencyBehaviors,
    ...constants.behavior.preferenceBehaviors,
  ]

  const activeBuyBehaviors = constants.behavior.buyBehaviors.filter((key) => pattern[key] !== null)
  const activeSellBehaviors = constants.behavior.sellBehaviors.filter((key) => pattern[key] !== null)

  // ------------------------------------------------------------ Handler --
  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = `${routerEnum.NAV.BEHAVIORS}/${behavior}/envs/${envId}`
    navigate(url)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <div className={classNames('row-start', classes.container)}>
      {activeBuyBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color={themeEnum.theme.INCREASE_COLOR}
          onClick={handleClickBehavior}
        />
      ))}
      {activeSellBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color={themeEnum.theme.DECREASE_COLOR}
          onClick={handleClickBehavior}
        />
      ))}
      {otherBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color='grey'
          onClick={handleClickBehavior}
        />
      ))}
    </div>
  )
}

export default PatternBehaviors
