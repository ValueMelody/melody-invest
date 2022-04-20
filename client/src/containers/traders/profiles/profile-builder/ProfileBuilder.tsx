import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as vendorTool from '../../../../tools/vendor'
import * as localeTool from '../../../../tools/locale'
import * as routerTool from '../../../../tools/router'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import ProfileBuilderGroup from './ProfileBuilderGroup'
import BehaviorEditor from '../../elements/BehaviorEditor'
import TraderEnvCard from '../../elements/TraderEnvCard'
import useTraderState from '../../../../states/useTraderState'
import useUserState from '../../../../states/useUserState'
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
  const navigate = vendorTool.router.useNavigate()
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

  const { getUser } = useUserState()
  const { createTraderProfile } = useTraderState()
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
      behaviors: constants.behavior.indicatorIncreaseSellBehaviors,
    },
    {
      title: `* ${localeTool.t('behaviorGroup.indicatorDecreaseSellBehaviors')}`,
      behaviors: constants.behavior.indicatorDecreaseSellBehaviors,
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

  const handleSubmit = async (
    e: vendorTool.react.FormEvent<HTMLFormElement>,
  ) => {
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
      const link = routerTool.profileDetailRoute(result.traderId, result.accessCode)
      navigate(link)
    }
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
              {constants.behavior.frequencyBehaviors.map((behavior) => (
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
        {user.userTraderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
            traderEnv={traderEnv}
            isActive={traderEnv.id === selectedTraderEnvId}
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
