import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as vendorTool from '../../../../tools/vendor'
import * as localeTool from '../../../../tools/locale'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import ProfileBuilderGroup from './ProfileBuilderGroup'
import BehaviorEditor from '../../elements/BehaviorEditor'
import TraderEnvCard from '../../elements/TraderEnvCard'
import useTraderRequest from '../../../../requests/useTraderRequest'
import useTraderState from '../../../../states/useTraderState'
import usePrivateGuard from '../../../hooks/usePrivateGuard'

const useStyles = vendorTool.jss.createUseStyles(({
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
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const [isBuyBehaviorsExtended, setIsBuyBehaviorsExtended] = vendorTool.react.useState(false)
  const [isSellBehaviorsExtended, setIsSellBehaviorsExtended] = vendorTool.react.useState(false)
  const [isPreferenceBehaviorsExtended, setIsPreferenceBehaviorsExtended] = vendorTool.react.useState(false)
  const [isAllocateBehaviorsExtended, setIsAllocateBehaviorsExtended] = vendorTool.react.useState(false)
  const [isFrequencyBehaviorsExtended, setIsFrequencyBehaviorsExtended] = vendorTool.react.useState(false)
  const [currentEditingBehavior, setCurrentEditingBehavior] = vendorTool.react.useState<ActiveBehavior>(null)
  const [behaviorValues, setBehaviorValues] = vendorTool.react.useState<BehaviorValues>({})
  const [selectedTraderEnvId, setSelectedTraderEnvId] = vendorTool.react.useState(1)

  const { getTraderEnvs } = useTraderState()
  const { createTraderProfile } = useTraderRequest()
  const traderEnvs = getTraderEnvs()

  const BUY_GROUPS = [
    {
      title: `* ${localeTool.t('behaviorGroup.priceIncreaseBuyBehaviors')}`,
      behaviors: constants.Behavior.PriceIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.priceDecreaseBuyBehaviors')}`,
      behaviors: constants.Behavior.PriceDecreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialImproveBuyBehaviors')}`,
      behaviors: constants.Behavior.FinancialImproveBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialWorsenBuyBehaviors')}`,
      behaviors: constants.Behavior.FinancialWorsenBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorIncreaseBuyBehaviors')}`,
      behaviors: constants.Behavior.IndicatorIncreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseBuyBehaviors')}`,
      behaviors: constants.Behavior.IndicatorDecreaseBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyImproveBuyBehaviors')}`,
      behaviors: constants.Behavior.EconomyImproveBuyBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyWorsenBuyBehaviors')}`,
      behaviors: constants.Behavior.EconomyWorsenBuyBehaviors,
    },
  ]

  const SELL_GROUPS = [
    {
      title: `* ${localeTool.t('behaviorGroup.priceIncreaseSellBehaviors')}`,
      behaviors: constants.Behavior.PriceIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.priceDecreaseSellBehaviors')}`,
      behaviors: constants.Behavior.PriceDecreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialImproveSellBehaviors')}`,
      behaviors: constants.Behavior.FinancialImproveSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.financialWorsenSellBehaviors')}`,
      behaviors: constants.Behavior.FinancialWorsenSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorIncreaseSellBehaviors')}`,
      behaviors: constants.Behavior.IndicatorIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseSellBehaviors')}`,
      behaviors: constants.Behavior.IndicatorDecreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyImproveSellBehaviors')}`,
      behaviors: constants.Behavior.EconomyImproveSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.economyWorsenSellBehaviors')}`,
      behaviors: constants.Behavior.EconomyWorsenSellBehaviors,
    },
  ]

  const activeBuyBehaviorCount = getActiveBehaviorCount(
    constants.Behavior.BuyBehaviors, behaviorValues,
  )
  const isValidBuyBehavior = activeBuyBehaviorCount >= 1

  const activeSellBehaviorCount = getActiveBehaviorCount(
    constants.Behavior.SellBehaviors, behaviorValues,
  )
  const isValidSellBehavior = activeSellBehaviorCount >= 1

  const activePreferenceBehaviorCount = getActiveBehaviorCount(
    constants.Behavior.PreferenceBehaviors, behaviorValues,
  )
  const isValidPreferenceBehavior = activePreferenceBehaviorCount === constants.Behavior.PreferenceBehaviors.length

  const activeAllocateBehaviorCount = getActiveBehaviorCount(
    constants.Behavior.AllocateBehaviors, behaviorValues,
  )
  const isValidAllocateBehavior = activeAllocateBehaviorCount === constants.Behavior.AllocateBehaviors.length

  const activeFrequencyBehaviorCount = getActiveBehaviorCount(
    constants.Behavior.FrequencyBehaviors, behaviorValues,
  )
  const isValidFrequencyBehavior = activeFrequencyBehaviorCount === constants.Behavior.FrequencyBehaviors.length

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

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    // @ts-ignore
    const defaultValues: interfaces.traderPatternModel.Create = { hashCode: '' }
    const traderPattern = constants
      .Behavior.Behaviors.reduce((
        values: interfaces.traderPatternModel.Create,
        behavior: interfaces.traderPatternModel.Behavior,
      ) => ({
        ...values,
        [behavior]: behaviorValues[behavior],
      }), defaultValues)
    await createTraderProfile(selectedTraderEnvId, traderPattern)
  }

  // ------------------------------------------------------------ UI --

  return (
    <section>
      <header className='row-around'>
        <h2>{localeTool.t('profileBuilder.title')}</h2>
      </header>
      <vendorTool.ui.Segment.Group>
        <vendorTool.ui.Segment>
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
        </vendorTool.ui.Segment>
        <vendorTool.ui.Segment>
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
        </vendorTool.ui.Segment>
        <vendorTool.ui.Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.preferenceBehaviors')}
            activeCount={activePreferenceBehaviorCount}
            isValid={isValidPreferenceBehavior}
            isExtended={isPreferenceBehaviorsExtended}
            onExtend={handleTogglePreferenceBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isPreferenceBehaviorsExtended && (
            <vendorTool.ui.Segment secondary>
              {constants.Behavior.PreferenceBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValues[behavior] || null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </vendorTool.ui.Segment>
          )}
        </vendorTool.ui.Segment>
        <vendorTool.ui.Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.allocateBehaviors')}
            activeCount={activeAllocateBehaviorCount}
            isValid={isValidAllocateBehavior}
            isExtended={isAllocateBehaviorsExtended}
            onExtend={handleToggleAllocateBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isAllocateBehaviorsExtended && (
            <vendorTool.ui.Segment secondary>
              {constants.Behavior.AllocateBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValues[behavior] || null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </vendorTool.ui.Segment>
          )}
        </vendorTool.ui.Segment>
        <vendorTool.ui.Segment>
          <ProfileBuilderHeader
            title={localeTool.t('profileBuilder.frequencyBehaviors')}
            activeCount={activeFrequencyBehaviorCount}
            isValid={isValidFrequencyBehavior}
            isExtended={isFrequencyBehaviorsExtended}
            onExtend={handleToggleFrequencyBehaviors}
            invalidMessage={localeTool.t('profileBuilder.requireAll')}
          />
          {isFrequencyBehaviorsExtended && (
            <vendorTool.ui.Segment secondary>
              {constants.Behavior.FrequencyBehaviors.map((behavior) => (
                <BehaviorEditor
                  key={behavior}
                  behavior={behavior}
                  behaviorValue={behaviorValues[behavior] ?? null}
                  isEditing={currentEditingBehavior === behavior}
                  onClick={handleClickBehavior}
                  onSelect={handleSelectValue}
                />
              ))}
            </vendorTool.ui.Segment>
          )}
        </vendorTool.ui.Segment>
      </vendorTool.ui.Segment.Group>
      <h4>{localeTool.t('common.selectEnvironment')}:</h4>
      <div className='row-start'>
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.record.id}
            traderEnv={traderEnv.record}
            isActive={traderEnv.record.id === selectedTraderEnvId}
            onClick={handleSelectEnv}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='row-around'>
          <vendorTool.ui.Button
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
            {localeTool.t('common.confirmAndWatch')}
          </vendorTool.ui.Button>
        </div>
      </form>
    </section>
  )
}

export default ProfileBuilder
