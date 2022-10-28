import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import { createUseStyles } from 'react-jss'
import * as routerTool from 'tools/router'
import useCommonStyle from 'styles/useCommonStyle'
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
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const otherBehaviors: interfaces.traderPatternModel.Behavior[] = [
    ...constants.Behavior.AllocateBehaviors,
    ...constants.Behavior.FrequencyBehaviors,
    ...constants.Behavior.PreferenceBehaviors,
  ]

  const activeBuyBehaviors = constants.Behavior.BuyBehaviors
    .filter((key) => pattern[key] !== null && pattern[key] !== undefined)
  const activeSellBehaviors = constants.Behavior.SellBehaviors
    .filter((key) => pattern[key] !== null && pattern[key] !== undefined)

  // ------------------------------------------------------------ Handler --
  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = routerTool.behaviorDetailRoute(envId, behavior)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  return (
    <div className={classNames(
      commonClasses.rowStart,
      classes.container,
    )}>
      {activeBuyBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color='success'
          onClick={handleClickBehavior}
        />
      ))}
      {activeSellBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color='failure'
          onClick={handleClickBehavior}
        />
      ))}
      {otherBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          behavior={behavior}
          value={pattern[behavior]}
          color='gray'
          onClick={handleClickBehavior}
        />
      ))}
    </div>
  )
}

export default PatternBehaviors
