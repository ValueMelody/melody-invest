import { useState } from 'react'
import classNames from 'classnames'
import { Segment, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as localeTool from '../../tools/locale'
import BehaviorEditor from './elements/BehaviorEditor'

const useStyles = createUseStyles({
  segmentHeader: {
    marginBottom: '1rem',
  },
  segmentTitle: {
    margin: '0 !important',
  },
  subSegment: {
    padding: '0.5rem !important',
  },
  groupTitle: {
    marginLeft: '0.5rem !important',
  },
  count: {
    marginLeft: '0.5rem !important',
    marginRight: '1rem !important',
  },
  invalidMessage: {
    color: 'red',
  },
})

type ActiveBehavior = interfaces.traderPatternModel.Behavior | null

type SelectedValue = number | null

type BehaviorValueDict = {
  [key in interfaces.traderPatternModel.Behavior]?: SelectedValue
}

const GroupHeader = ({
  title,
  activeCount,
  isValid,
  invalidMessage,
  isExtended,
  onExtend,
}: {
  title: string;
  activeCount: number;
  isValid: boolean;
  invalidMessage: string;
  isExtended: boolean;
  onExtend: () => void;
}) => {
  const classes = useStyles()

  const handleToggleBuyBehaviors = () => {
    if (!onExtend) return
    onExtend()
  }

  return (
    <header
      onClick={handleToggleBuyBehaviors}
      className={classNames('row-start', 'click-cursor', {
        [classes.segmentHeader]: isExtended,
      })}
    >
      <h3 className={classes.segmentTitle}>
        {title}
      </h3>
      <Icon
        size='large'
        color='blue'
        name={isExtended ? 'caret down' : 'caret right'}
      />
      <h5 className={classes.count}>
        {localeTool.t('common.numSelected', { num: activeCount })}
      </h5>
      {isValid && <Icon name='checkmark' color='green' />}
      {!isValid && <h5 className={classes.invalidMessage}>* {invalidMessage}</h5>}
    </header>
  )
}

const GroupSection = ({
  title,
  behaviors,
  currentBehavior,
  behaviorValueDict,
  onClickBehavior,
  onSelectValue,
} : {
  title: string;
  behaviors: interfaces.traderPatternModel.Behavior[];
  currentBehavior: ActiveBehavior;
  behaviorValueDict: BehaviorValueDict;
  onClickBehavior: (behavior: interfaces.traderPatternModel.Behavior) => void;
  onSelectValue: (behavior: interfaces.traderPatternModel.Behavior, value: SelectedValue) => void;
}) => {
  const classes = useStyles()

  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => onClickBehavior(behavior)

  const handleSelectValue = (
    behavior: interfaces.traderPatternModel.Behavior,
    value: SelectedValue,
  ) => {
    onSelectValue(behavior, value)
  }

  return (
    <Segment secondary className={classes.subSegment}>
      <h5 className={classes.groupTitle}>
        {title}
      </h5>
      {behaviors.map((behavior) => (
        <BehaviorEditor
          key={behavior}
          behavior={behavior}
          behaviorValue={behaviorValueDict[behavior] || null}
          isEditing={behavior === currentBehavior}
          onClick={handleClickBehavior}
          onSelect={handleSelectValue}
        />
      ))}
    </Segment>
  )
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

  return (
    <div>
      <div className='row-around'>
        <h2>{localeTool.t('profileBuilder.title')}</h2>
      </div>
      <Segment.Group>
        <Segment>
          <GroupHeader
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
                <GroupSection
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
          <GroupHeader
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
                <GroupSection
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
          <GroupHeader
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
          <GroupHeader
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
          <GroupHeader
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
    </div>
  )
}

export default ProfileBuilder
