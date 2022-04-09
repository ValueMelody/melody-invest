import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../../tools/vendor'
import BehaviorEditor from '../../elements/BehaviorEditor'

const useStyles = vendorTool.jss.createUseStyles({
  segment: {
    padding: '0.5rem !important',
  },
  groupTitle: {
    marginLeft: '0.5rem !important',
  },
})

type ActiveBehavior = interfaces.traderPatternModel.Behavior | null

type SelectedValue = number | null

type BehaviorValues = {
  [key in interfaces.traderPatternModel.Behavior]?: SelectedValue
}

const ProfileBuilderGroup = ({
  title,
  behaviors,
  currentBehavior,
  behaviorValues,
  onClickBehavior,
  onSelectValue,
} : {
  title: string;
  behaviors: interfaces.traderPatternModel.Behavior[];
  currentBehavior: ActiveBehavior;
  behaviorValues: BehaviorValues;
  onClickBehavior: (behavior: interfaces.traderPatternModel.Behavior) => void;
  onSelectValue: (behavior: interfaces.traderPatternModel.Behavior, value: SelectedValue) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => onClickBehavior(behavior)

  const handleSelectValue = (
    behavior: interfaces.traderPatternModel.Behavior,
    value: SelectedValue,
  ) => {
    onSelectValue(behavior, value)
  }

  // ------------------------------------------------------------ Interface --

  return (
    <vendorTool.ui.Segment secondary className={classes.segment}>
      <h5 className={classes.groupTitle}>
        {title}
      </h5>
      {behaviors.map((behavior) => (
        <BehaviorEditor
          key={behavior}
          behavior={behavior}
          behaviorValue={behaviorValues[behavior] ?? null}
          isEditing={behavior === currentBehavior}
          onClick={handleClickBehavior}
          onSelect={handleSelectValue}
        />
      ))}
    </vendorTool.ui.Segment>
  )
}

export default ProfileBuilderGroup
