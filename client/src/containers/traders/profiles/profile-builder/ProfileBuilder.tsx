import { useState, FormEvent } from 'react'
import { Button, Accordion } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import useTraderRequest from 'requests/useTraderRequest'
import useTraderState from 'states/useTraderState'
import usePrivateGuard from 'handlers/usePrivateGuard'
import BehaviorEditor from 'containers/traders/elements/BehaviorEditor'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import ProfileBuilderHeader from './ProfileBuilderHeader'
import ProfileBuilderGroup from './ProfileBuilderGroup'

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

  // ------------------------------------------------------------ State --

  const [currentEditingBehavior, setCurrentEditingBehavior] = useState<ActiveBehavior>(null)
  const [behaviorValues, setBehaviorValues] = useState<BehaviorValues>({})
  const [selectedTraderEnvId, setSelectedTraderEnvId] = useState(1)

  const { getTraderEnvs } = useTraderState()
  const { createTraderProfile } = useTraderRequest()
  const traderEnvs = getTraderEnvs()

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
    e: FormEvent<HTMLFormElement>,
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
    <section className='flex flex-col'>
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
        {localeTool.t('common.selectEnvironment')}:
      </h2>
      <section className='flex justify-center'>
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.record.id}
            className='mx-4'
            traderEnv={traderEnv.record}
            isActive={traderEnv.record.id === selectedTraderEnvId}
            onClick={handleSelectEnv}
          />
        ))}
      </section>
      <form onSubmit={handleSubmit}>
        <footer className='flex flex-col items-center mt-6'>
          <Button
            type='submit'
            disabled={
              !isValidBuyBehavior ||
              !isValidSellBehavior ||
              !isValidAllocateBehavior ||
              !isValidFrequencyBehavior ||
              !isValidPreferenceBehavior
            }
          >
            {localeTool.t('common.confirmAndWatch')}
          </Button>
        </footer>
      </form>
    </section>
  )
}

export default ProfileBuilder
