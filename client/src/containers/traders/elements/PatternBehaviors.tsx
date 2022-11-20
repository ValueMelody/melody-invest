import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as routerTool from 'tools/router'
import BehaviorLabel from './BehaviorLabel'
import { useNavigate } from 'react-router-dom'

const labelClass = 'mx-2 my-1 w-auto'

const PatternBehaviors = ({
  pattern,
  envId,
}: {
  pattern: interfaces.traderPatternModel.Public;
  envId: number;
}) => {
  const navigate = useNavigate()

  const otherBehaviors: interfaces.traderPatternModel.Behavior[] = [
    ...constants.Behavior.AllocateBehaviors,
    ...constants.Behavior.FrequencyBehaviors,
    ...constants.Behavior.PreferenceBehaviors,
  ]

  const activeBuyBehaviors = constants.Behavior.BuyBehaviors
    .filter((key) => pattern[key] !== null && pattern[key] !== undefined)
  const activeSellBehaviors = constants.Behavior.SellBehaviors
    .filter((key) => pattern[key] !== null && pattern[key] !== undefined)

  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => {
    const url = routerTool.behaviorDetailRoute(envId, behavior)
    navigate(url)
  }

  return (
    <div className='flex flex-wrap'>
      {activeBuyBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          className={labelClass}
          behavior={behavior}
          value={pattern[behavior]}
          color='success'
          onClick={handleClickBehavior}
        />
      ))}
      {activeSellBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          className={labelClass}
          behavior={behavior}
          value={pattern[behavior]}
          color='failure'
          onClick={handleClickBehavior}
        />
      ))}
      {otherBehaviors.map((behavior) => (
        <BehaviorLabel
          key={behavior}
          className={labelClass}
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
