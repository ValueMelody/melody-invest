import * as interfaces from '@shared/interfaces'
import BehaviorEditor from 'containers/traders/elements/BehaviorEditor'
import { Card } from 'flowbite-react'

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
  const handleClickBehavior = (behavior: interfaces.traderPatternModel.Behavior) => onClickBehavior(behavior)

  const handleSelectValue = (
    behavior: interfaces.traderPatternModel.Behavior,
    value: SelectedValue,
  ) => {
    onSelectValue(behavior, value)
  }

  return (
    <Card data-testid='profileBuilderGroup'>
      <h3>
        {title}
      </h3>
      <section className='flex flex-wrap'>
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
      </section>
    </Card>
  )
}

export default ProfileBuilderGroup
