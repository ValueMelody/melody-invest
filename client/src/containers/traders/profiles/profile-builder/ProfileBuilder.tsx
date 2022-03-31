import { useState, FormEvent } from 'react'
import { Segment, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as localeTool from '../../../../tools/locale'
import * as routerEnum from '../../../../enums/router'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import ProfileBuilderGroup from './ProfileBuilderGroup'
import BehaviorEditor from '../../elements/BehaviorEditor'
import TraderEnvCard from '../../elements/TraderEnvCard'
import useTraderState from '../../../../states/useTraderState'
import useUserState from '../../../../states/useUserState'
import usePrivateGuard from '../../../hooks/usePrivateGuard'

const useStyles = createUseStyles(({
  confirmButton: {
    marginTop: '2rem !important',
  },
}))

type ActiveBehavior = interfaces.traderPatternModel.Behavior | null

type SelectedValue = number | null

type BehaviorValues = {
  [key in interfaces.traderPatternModel.Behavior]?: SelectedValue
}

const getActiveBehaviorCount = (
  behaviors: interfaces.traderPatternModel.Behavior[],
  values: BehaviorValues,
): number => {
  const activeBehaviors = behaviors.filter((behavior) => values[behavior] !== null && values[behavior] !== undefined)
  return activeBehaviors.length
}

const ProfileBuilder = () => {
  const navigate = useNavigate()
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const [isBuyBehaviorsExtended, setIsBuyBehaviorsExtended] = useState(false)
  const [isSellBehaviorsExtended, setIsSellBehaviorsExtended] = useState(false)
  const [isPreferenceBehaviorsExtended, setIsPreferenceBehaviorsExtended] = useState(false)
  const [isAllocateBehaviorsExtended, setIsAllocateBehaviorsExtended] = useState(false)
  const [isFrequencyBehaviorsExtended, setIsFrequencyBehaviorsExtended] = useState(false)
  const [currentEditingBehavior, setCurrentEditingBehavior] = useState<ActiveBehavior>(null)
  const [behaviorValues, setBehaviorValues] = useState<BehaviorValues>({})
  const [selectedTraderEnvId, setSelectedTraderEnvId] = useState(1)

  const { getUser } = useUserState()
  const { createTraderProfile, getTraderEnv } = useTraderState()
  const user = getUser()

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
      behaviors: constants.behavior.indicatorIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseBuyBehaviors')}`,
      behaviors: constants.behavior.indicatorDecreaseBuyBehaviors,
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
      behaviors: constants.behavior.priceDecreaseSellBehaviors,
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
    constants.behavior.buyBehaviors, behaviorValues,
  )
  const isValidBuyBehavior = activeBuyBehaviorCount >= 1

  const activeSellBehaviorCount = getActiveBehaviorCount(
    constants.behavior.sellBehaviors, behaviorValues,
  )
  const isValidSellBehavior = activeSellBehaviorCount >= 1

  const activePreferenceBehaviorCount = getActiveBehaviorCount(
    constants.behavior.preferenceBehaviors, behaviorValues,
  )
  const isValidPreferenceBehavior = activePreferenceBehaviorCount === constants.behavior.preferenceBehaviors.length

  const activeAllocateBehaviorCount = getActiveBehaviorCount(
    constants.behavior.allocateBehaviors, behaviorValues,
  )
  const isValidAllocateBehavior = activeAllocateBehaviorCount === constants.behavior.allocateBehaviors.length

  const activeFrequencyBehaviorCount = getActiveBehaviorCount(
    constants.behavior.frequencyBehaviors, behaviorValues,
  )
  const isValidFrequencyBehavior = activeFrequencyBehaviorCount === constants.behavior.frequencyBehaviors.length

  // ------------------------------------------------------------ Handler --

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
    setBehaviorValues((values) => ({
      ...values,
      [behavior]: value,
    }))
    setCurrentEditingBehavior(null)
  }

  const handleSelectEnv = (envId: number) => {
    if (selectedTraderEnvId === envId) return
    setSelectedTraderEnvId(envId)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // @ts-ignore
    const defaultValues: interfaces.traderPatternModel.Create = { hashCode: '' }
    const traderPattern = constants
      .behavior.behaviors.reduce((
        values: interfaces.traderPatternModel.Create,
        behavior: interfaces.traderPatternModel.Behavior,
      ) => ({
        ...values,
        [behavior]: behaviorValues[behavior],
      }), defaultValues)
    const result = await createTraderProfile(selectedTraderEnvId, traderPattern)
    if (result) {
      const link = `${routerEnum.NAV.TRADERS}/profiles/${result.traderId}/${result.accessCode}`
      navigate(link)
    }
  }

  // ------------------------------------------------------------ Interface --

  return (
    <section>
      <header className='row-around'>
        <h2>{localeTool.t('profileBuilder.title')}</h2>
      </header>
      <Segment.Group>
        <Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.buyBehaviors')}
            isExtended={isBuyBehaviorsExtended}
            onExtend={handleToggleBuyBehaviors}
            activeCount={activeBuyBehaviorCount}
            isValid={isValidBuyBehavior}
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
                  behaviorValues={behaviorValues}
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
            isValid={isValidSellBehavior}
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
                  behaviorValues={behaviorValues}
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
            isValid={isValidPreferenceBehavior}
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
                  behaviorValue={behaviorValues[behavior] || null}
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
            isValid={isValidAllocateBehavior}
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
                  behaviorValue={behaviorValues[behavior] || null}
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
            isValid={isValidFrequencyBehavior}
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
                  behaviorValue={behaviorValues[behavior] || null}
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
        {user.userTraderEnvIds.map((traderEnvId) => (
          <TraderEnvCard
            key={traderEnvId}
            traderEnv={getTraderEnv(traderEnvId)}
            isActive={traderEnvId === selectedTraderEnvId}
            onClick={handleSelectEnv}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='row-around'>
          <Button
            type='submit'
            color='blue'
            className={classes.confirmButton}
            disabled={
              !isValidBuyBehavior ||
              !isValidSellBehavior ||
              !isValidAllocateBehavior ||
              !isValidFrequencyBehavior ||
              !isValidPreferenceBehavior
            }
          >
            {localeTool.t('profileBuilder.confirm')}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ProfileBuilder
