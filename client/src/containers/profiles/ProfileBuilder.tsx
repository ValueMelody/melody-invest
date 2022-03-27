import { useState } from 'react'
import { Segment } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as localeTool from '../../tools/locale'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import ProfileBuilderGroup from './ProfileBuilderGroup'
import BehaviorEditor from './elements/BehaviorEditor'
import TraderEnvCard from './elements/TraderEnvCard'
import useSystem from '../../states/useSystem'
import useTraderEnv from '../../states/useTraderEnv'

type ActiveBehavior = interfaces.traderPatternModel.Behavior | null

type SelectedValue = number | null

type BehaviorValueDict = {
  [key in interfaces.traderPatternModel.Behavior]?: SelectedValue
}

const getActiveBehaviorCount = (
  behaviors: interfaces.traderPatternModel.Behavior[],
  valueDict: BehaviorValueDict,
): number => {
  const activeBehaviors = behaviors.filter((behavior) => valueDict[behavior] !== null && valueDict[behavior] !== undefined)
  return activeBehaviors.length
}

const ProfileBuilder = () => {
  const [isBuyBehaviorsExtended, setIsBuyBehaviorsExtended] = useState(false)
  const [isSellBehaviorsExtended, setIsSellBehaviorsExtended] = useState(false)
  const [isPreferenceBehaviorsExtended, setIsPreferenceBehaviorsExtended] = useState(false)
  const [isAllocateBehaviorsExtended, setIsAllocateBehaviorsExtended] = useState(false)
  const [isFrequencyBehaviorsExtended, setIsFrequencyBehaviorsExtended] = useState(false)
  const [currentEditingBehavior, setCurrentEditingBehavior] = useState<ActiveBehavior>(null)
  const [behaviorValueDict, setBehaviorValueDict] = useState<BehaviorValueDict>({})
  const [selectedTraderEnvId, setSelectedTraderEnvId] = useState(1)

  const { systemTraderEnvIds } = useSystem()
  const { getTraderEnv } = useTraderEnv()

  const BUY_GROUPS = [
    {
      title: `* ${localeTool.t('behaviorGroup.priceIncreaseBuyBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.priceDecreaseBuyBehaviors')}`,
      behaviors: constants.behavior.priceDecreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialImproveBuyBehaviors')}`,
      behaviors: constants.behavior.financialImproveBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialWorsenBuyBehaviors')}`,
      behaviors: constants.behavior.financialWorsenBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorIncreaseBuyBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseBuyBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyImproveBuyBehaviors')}`,
      behaviors: constants.behavior.economyImproveBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyWorsenBuyBehaviors')}`,
      behaviors: constants.behavior.economyWorsenBuyBehaviors,
    },
  ]

  const SELL_GROUPS = [
    {
      title: `* ${localeTool.t('behaviorGroup.priceIncreaseSellBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.priceDecreaseSellBehaviors')}`,
      behaviors: constants.behavior.priceDecreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialImproveSellBehaviors')}`,
      behaviors: constants.behavior.financialImproveSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialWorsenSellBehaviors')}`,
      behaviors: constants.behavior.financialWorsenSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorIncreaseSellBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseSellBehaviors')}`,
      behaviors: constants.behavior.priceIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyImproveSellBehaviors')}`,
      behaviors: constants.behavior.economyImproveSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyWorsenSellBehaviors')}`,
      behaviors: constants.behavior.economyWorsenSellBehaviors,
    },
  ]

  const activeBuyBehaviorCount = getActiveBehaviorCount(
    constants.behavior.buyBehaviors, behaviorValueDict,
  )
  const activeSellBehaviorCount = getActiveBehaviorCount(
    constants.behavior.sellBehaviors, behaviorValueDict,
  )
  const activePreferenceBehaviorCount = getActiveBehaviorCount(
    constants.behavior.preferenceBehaviors, behaviorValueDict,
  )
  const activeAllocateBehaviorCount = getActiveBehaviorCount(
    constants.behavior.allocateBehaviors, behaviorValueDict,
  )
  const activeFrequencyBehaviorCount = getActiveBehaviorCount(
    constants.behavior.frequencyBehaviors, behaviorValueDict,
  )

  const handleToggleBuyBehaviors = () => setIsBuyBehaviorsExtended(!isBuyBehaviorsExtended)

  const handleToggleSellBehaviors = () => setIsSellBehaviorsExtended(!isSellBehaviorsExtended)

  const handleTogglePreferenceBehaviors = () => setIsPreferenceBehaviorsExtended(!isPreferenceBehaviorsExtended)

  const handleToggleAllocateBehaviors = () => setIsAllocateBehaviorsExtended(!isAllocateBehaviorsExtended)

  const handleToggleFrequencyBehaviors = () => setIsFrequencyBehaviorsExtended(!isFrequencyBehaviorsExtended)

  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => {
    if (behavior === currentEditingBehavior) {
      setCurrentEditingBehavior(null)
    } else {
      setCurrentEditingBehavior(behavior)
    }
  }

  const handleSelectValue = (
    behavior: interfaces.traderPatternModel.Behavior,
    value: SelectedValue,
  ) => {
    setBehaviorValueDict((valueDict) => ({
      ...valueDict,
      [behavior]: value,
    }))
    setCurrentEditingBehavior(null)
  }

  const handleSelectEnv = (envId: number) => {
    if (selectedTraderEnvId === envId) return
    setSelectedTraderEnvId(envId)
  }

  return (
    <div>
      <div className='row-around'>
        <h2>{localeTool.t('profileBuilder.title')}</h2>
      </div>
      <Segment.Group>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.buyBehaviors')}
            isExtended={isBuyBehaviorsExtended}
            onExtend={handleToggleBuyBehaviors}
            activeCount={activeBuyBehaviorCount}
            isValid={activeBuyBehaviorCount >= 1}
            invalidMessage={localeTool.t('profileBuilder.requireOne')}
          />
          {isBuyBehaviorsExtended && (
            <div>
              {BUY_GROUPS.map((buyGroup) => (
                <ProfileBuilderGroup
                  key={buyGroup.title}
                  title={buyGroup.title}
                  behaviors={buyGroup.behaviors}
                  currentBehavior={currentEditingBehavior}
                  behaviorValueDict={behaviorValueDict}
                  onClickBehavior={handleClickBehavior}
                  onSelectValue={handleSelectValue}
                />
              ))}
            </div>
          )}
        </Segment>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.sellBehaviors')}
            isExtended={isSellBehaviorsExtended}
            onExtend={handleToggleSellBehaviors}
            activeCount={activeSellBehaviorCount}
            isValid={activeSellBehaviorCount >= 1}
            invalidMessage={localeTool.t('profileBuilder.requireOne')}
          />
          {isSellBehaviorsExtended && (
            <div>
              {SELL_GROUPS.map((sellGroup) => (
                <ProfileBuilderGroup
                  key={sellGroup.title}
                  title={sellGroup.title}
                  behaviors={sellGroup.behaviors}
                  currentBehavior={currentEditingBehavior}
                  behaviorValueDict={behaviorValueDict}
                  onClickBehavior={handleClickBehavior}
                  onSelectValue={handleSelectValue}
                />
              ))}
            </div>
          )}
        </Segment>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.preferenceBehaviors')}
            activeCount={activePreferenceBehaviorCount}
            isValid={activePreferenceBehaviorCount === constants.behavior.preferenceBehaviors.length}
            isExtended={isPreferenceBehaviorsExtended}
            onExtend={handleTogglePreferenceBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isPreferenceBehaviorsExtended && (
            <Segment secondary>
              {constants.behavior.preferenceBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValueDict[behavior] || null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </Segment>
          )}
        </Segment>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.allocateBehaviors')}
            activeCount={activeAllocateBehaviorCount}
            isValid={activeAllocateBehaviorCount === constants.behavior.allocateBehaviors.length}
            isExtended={isAllocateBehaviorsExtended}
            onExtend={handleToggleAllocateBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isAllocateBehaviorsExtended && (
            <Segment secondary>
              {constants.behavior.allocateBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValueDict[behavior] || null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </Segment>
          )}
        </Segment>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.frequencyBehaviors')}
            activeCount={activeFrequencyBehaviorCount}
            isValid={activeFrequencyBehaviorCount === constants.behavior.frequencyBehaviors.length}
            isExtended={isFrequencyBehaviorsExtended}
            onExtend={handleToggleFrequencyBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isFrequencyBehaviorsExtended && (
            <Segment secondary>
              {constants.behavior.frequencyBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValueDict[behavior] || null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </Segment>
          )}
        </Segment>
      </Segment.Group>
      <h4>{localeTool.t('common.envs')}:</h4>
      <div className='row-start'>
        {systemTraderEnvIds.map((traderEnvId) => {
          const traderEnv = getTraderEnv(traderEnvId)!
          return (
            <TraderEnvCard
              key={traderEnvId}
              traderEnv={traderEnv}
              isActive={traderEnvId === selectedTraderEnvId}
              onClick={handleSelectEnv}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ProfileBuilder
