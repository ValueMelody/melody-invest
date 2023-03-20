import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { Accordion, Alert, Button } from 'flowbite-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import BehaviorEditor from 'containers/traders/elements/BehaviorEditor'
import ProfileBuilderGroup from './ProfileBuilderGroup'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import usePrivateGuard from 'hooks/usePrivateGuard'

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

const subTitleClass = 'text-center font-semibold text-lg mb-4'

const ProfileBuilder = () => {
  usePrivateGuard()
  const location = useLocation()
  const pattern = location.state as interfaces.traderPatternModel.Public | undefined
  const ref = useRef(null)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [currentEditingBehavior, setCurrentEditingBehavior] = useState<ActiveBehavior>(null)
  const [behaviorValues, setBehaviorValues] = useState<BehaviorValues>(pattern || {})
  const [selectedTraderEnvId, setSelectedTraderEnvId] = useState(1)

  const traderEnvs = useSelector(selectors.selectTraderEnvBases())
  const { userTraderIds } = useSelector(selectors.selectUser())
  const traderDict = useSelector(selectors.selectTraderProfileBaseDict())
  const userTraders = userTraderIds.map((id) => traderDict[id])
  const currentPattern = JSON.stringify({
    ...behaviorValues,
    id: undefined,
  })
  const hasMatchedPattern = userTraders.some((trader) => {
    const traderPattern = {
      ...trader.pattern,
      id: undefined,
    }
    return currentPattern === JSON.stringify(traderPattern) && selectedTraderEnvId === trader.trader.traderEnvId
  })

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

  useEffect(() => {
    if (!ref.current) return
    const container = ref.current as HTMLElement
    if (container?.childNodes?.length >= 3 && container?.childNodes[2]?.childNodes?.length) {
      const button = container.childNodes[2].childNodes[0] as HTMLButtonElement
      if (button?.click) button.click()
    }
  }, [ref])

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

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    const patternMock = {} as interfaces.traderPatternModel.Create
    const defaultValues = { ...patternMock, hashCode: '' }

    const traderPattern = constants
      .Behavior.Behaviors.reduce((
        values: interfaces.traderPatternModel.Create,
        behavior: interfaces.traderPatternModel.Behavior,
      ) => ({
        ...values,
        [behavior]: behaviorValues[behavior],
      }), defaultValues)
    dispatch(actions.createTraderProfile({
      traderEnvId: selectedTraderEnvId,
      traderPattern,
    })).then((res: any) => {
      if (res?.payload?.trader?.id && res?.payload?.trader?.accessCode) {
        const link = routerTool.profileDetailRoute(res.payload.trader.id, res.payload.trader.accessCode)
        navigate(link)
      }
    })
  }

  return (
    <section
      ref={ref}
      className='flex flex-col'
    >
      <h1 className='builder-title'>
        {localeTool.t('profileBuilder.title')}
      </h1>
      <h2 className={subTitleClass}>
        {localeTool.t('profileBuilder.selectBehaviors')}
      </h2>
      <Accordion
        alwaysOpen
        className='mb-12'
      >
        <Accordion.Panel>
          <Accordion.Title>
            <ProfileBuilderHeader
              title={localeTool.t('profileBuilder.buyBehaviors')}
              activeCount={activeBuyBehaviorCount}
              isValid={isValidBuyBehavior}
              invalidMessage={localeTool.t('profileBuilder.requireOne')}
            />
          </Accordion.Title>
          <Accordion.Content>
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
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <ProfileBuilderHeader
              title={localeTool.t('profileBuilder.sellBehaviors')}
              activeCount={activeSellBehaviorCount}
              isValid={isValidSellBehavior}
              invalidMessage={localeTool.t('profileBuilder.requireOne')}
            />
          </Accordion.Title>
          <Accordion.Content>
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
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <ProfileBuilderHeader
              title={localeTool.t('profileBuilder.preferenceBehaviors')}
              activeCount={activePreferenceBehaviorCount}
              isValid={isValidPreferenceBehavior}
              invalidMessage={localeTool.t('profileBuilder.requireAll')}
            />
          </Accordion.Title>
          <Accordion.Content>
            <section className='flex flex-wrap'>
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
            </section>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <ProfileBuilderHeader
              title={localeTool.t('profileBuilder.allocateBehaviors')}
              activeCount={activeAllocateBehaviorCount}
              isValid={isValidAllocateBehavior}
              invalidMessage={localeTool.t('profileBuilder.requireAll')}
            />
          </Accordion.Title>
          <Accordion.Content>
            <section className='flex flex-wrap'>
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
            </section>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <ProfileBuilderHeader
              title={localeTool.t('profileBuilder.frequencyBehaviors')}
              activeCount={activeFrequencyBehaviorCount}
              isValid={isValidFrequencyBehavior}
              invalidMessage={localeTool.t('profileBuilder.requireAll')}
            />
          </Accordion.Title>
          <Accordion.Content>
            <section className='flex flex-wrap'>
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
            </section>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <h2 className={subTitleClass}>
        {localeTool.t('profileBuilder.selectEnvironment')}:
      </h2>
      <section className='flex justify-center flex-wrap'>
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
            className='mx-4 mb-4'
            traderEnv={traderEnv}
            isActive={traderEnv.id === selectedTraderEnvId}
            onClick={handleSelectEnv}
          />
        ))}
      </section>
      {hasMatchedPattern && (
        <Alert
          color='failure'
          className='mt-8'
        >
          {localeTool.t('profileBuilder.duplicatedProfile')}
        </Alert>
      )}
      <form
        data-testid='submitForm'
        onSubmit={handleSubmit}
      >
        <footer className='flex flex-col items-center mt-6'>
          <Button
            data-testid='createBtn'
            type='submit'
            disabled={
              !isValidBuyBehavior ||
              !isValidSellBehavior ||
              !isValidAllocateBehavior ||
              !isValidFrequencyBehavior ||
              !isValidPreferenceBehavior ||
              hasMatchedPattern
            }
          >
            {localeTool.t('builder.confirmAndWatch')}
          </Button>
        </footer>
      </form>
    </section>
  )
}

export default ProfileBuilder
