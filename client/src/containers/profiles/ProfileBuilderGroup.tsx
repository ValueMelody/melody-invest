import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import { Segment } from 'semantic-ui-react'
import BehaviorEditor from './elements/BehaviorEditor'

const useStyles = createUseStyles({
  segment: {
    padding: '0.5rem !important',
  },
  groupTitle: {
    marginLeft: '0.5rem !important',
  },
})

type ActiveBehavior = interfaces.traderPatternModel.Behavior | null

type SelectedValue = number | null

type BehaviorValueDict = {
  [key in interfaces.traderPatternModel.Behavior]?: SelectedValue
}

const ProfileBuilderGroup = ({
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
    <Segment secondary className={classes.segment}>
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

export default ProfileBuilderGroup
