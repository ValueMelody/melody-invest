import { ChangeEvent } from 'react'
import { Select } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import BehaviorLabel from './BehaviorLabel'

const BehaviorEditor = ({
  behavior,
  isEditing,
  behaviorValue,
  onClick,
  onSelect,
}: {
  behavior: interfaces.traderPatternModel.Behavior;
  behaviorValue: number | null;
  isEditing: boolean;
  onClick: (behavior: interfaces.traderPatternModel.Behavior) => void;
  onSelect: (behavior: interfaces.traderPatternModel.Behavior, value: number | null) => void;
}) => {
  // ------------------------------------------------------------ State --

  const options = constants.BehaviorValue.Options[behavior]
  const hasValue = behaviorValue !== null && options.some((option) => option === behaviorValue)
  const selectOptions = options.map((option) => ({
    key: option, value: option, text: parseTool.behaviorValue(behavior, option),
  }))

  // ------------------------------------------------------------ Handler --

  const handleClick = () => onClick(behavior)

  const handleSelect = (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value === '' ? null : Number(e.target.value)
    onSelect(behavior, value)
  }

  // ------------------------------------------------------------ UI --

  if (!isEditing) {
    return (
      <BehaviorLabel
        className='mx-2 my-1'
        behavior={behavior}
        color={hasValue ? 'info' : 'gray'}
        value={behaviorValue}
        onClick={handleClick}
      />
    )
  }

  return (
    <section
      data-testid='behaviorEditor'
      className='w-full my-4 bg-blue-100 p-4 rounded-md'
    >
      <header className='flex mb-2'>
        <BehaviorLabel
          behavior={behavior}
          color='indigo'
          onClick={handleClick}
        />
        <h5>
          {parseTool.behaviorDesc(behavior)}
        </h5>
      </header>
      <Select
        data-testid='select'
        className='w-64'
        value={behaviorValue || ''}
        onChange={handleSelect}
      >
        <option value=''>
          {localeTool.t('profileBuilder.notSet')}
        </option>
        {selectOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.text}
          </option>
        ))}
      </Select>
    </section>
  )
}

export default BehaviorEditor
