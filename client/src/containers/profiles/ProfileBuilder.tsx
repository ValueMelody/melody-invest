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
})

const GroupHeader = ({
  title,
  isExtended,
  onToggle,
}: {
  title: string;
  isExtended: boolean;
  onToggle: () => void;
}) => {
  const classes = useStyles()

  const handleToggleBuyBehaviors = () => onToggle()

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
    </header>
  )
}

const GroupSection = ({
  title,
  behaviors,
} : {
  title: string;
  behaviors: interfaces.traderPatternModel.BehaviorType[];
}) => {
  const classes = useStyles()

  return (
    <Segment secondary className={classes.subSegment}>
      <h5 className={classes.groupTitle}>
        {title}
      </h5>
      {behaviors.map((behavior) => (
        <BehaviorEditor
          key={behavior}
          type={behavior}
        />
      ))}
    </Segment>
  )
}

const ProfileBuilder = () => {
  const [isBuyBehaviorsExtended, setIsBuyBehaviorsExtended] = useState(false)
  const [isSellBehaviorsExtended, setIsSellBehaviorsExtended] = useState(false)

  const handleToggleBuyBehaviors = () => setIsBuyBehaviorsExtended(!isBuyBehaviorsExtended)

  const handleToggleSellBehaviors = () => setIsSellBehaviorsExtended(!isSellBehaviorsExtended)

  return (
    <div>
      <div className='row-around'>
        <h2>{localeTool.t('profileBuild.title')}</h2>
      </div>
      <Segment.Group>
        <Segment>
          <GroupHeader
            title={localeTool.t('profileBuild.buyBehavior')}
            isExtended={isBuyBehaviorsExtended}
            onToggle={handleToggleBuyBehaviors}
          />
          {isBuyBehaviorsExtended && (
            <div>
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.priceIncreaseBuyBehaviors')}`}
                behaviors={constants.behavior.priceIncreaseBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.priceDecreaseBuyBehaviors')}`}
                behaviors={constants.behavior.priceDecreaseBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.financialImproveBuyBehaviors')}`}
                behaviors={constants.behavior.financialImproveBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.financialWorsenBuyBehaviors')}`}
                behaviors={constants.behavior.financialWorsenBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.indicatorIncreaseBuyBehaviors')}`}
                behaviors={constants.behavior.indicatorIncreaseBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.indicatorDecreaseBuyBehaviors')}`}
                behaviors={constants.behavior.indicatorDecreaseBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.economyImproveBuyBehaviors')}`}
                behaviors={constants.behavior.economyImproveBuyBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.economyWorsenBuyBehaviors')}`}
                behaviors={constants.behavior.economyWorsenBuyBehaviors}
              />
            </div>
          )}
        </Segment>
        <Segment>
          <GroupHeader
            title={localeTool.t('profileBuild.sellBehavior')}
            isExtended={isSellBehaviorsExtended}
            onToggle={handleToggleSellBehaviors}
          />
          {isSellBehaviorsExtended && (
            <div>
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.priceIncreaseSellBehaviors')}`}
                behaviors={constants.behavior.priceIncreaseSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.priceDecreaseSellBehaviors')}`}
                behaviors={constants.behavior.priceDecreaseSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.financialImproveSellBehaviors')}`}
                behaviors={constants.behavior.financialImproveSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.financialWorsenSellBehaviors')}`}
                behaviors={constants.behavior.financialWorsenSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.indicatorIncreaseSellBehaviors')}`}
                behaviors={constants.behavior.indicatorIncreaseSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.indicatorDecreaseSellBehaviors')}`}
                behaviors={constants.behavior.indicatorDecreaseSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.economyImproveSellBehaviors')}`}
                behaviors={constants.behavior.economyImproveSellBehaviors}
              />
              <GroupSection
                title={`* ${localeTool.t('behaviorGroup.economyWorsenSellBehaviors')}`}
                behaviors={constants.behavior.economyWorsenSellBehaviors}
              />
            </div>
          )}
        </Segment>
        <Segment>
          <GroupHeader
            title={localeTool.t('profileBuild.sellBehavior')}
            isExtended={isSellBehaviorsExtended}
            onToggle={handleToggleSellBehaviors}
          />
        </Segment>
      </Segment.Group>
    </div>
  )
}

export default ProfileBuilder
