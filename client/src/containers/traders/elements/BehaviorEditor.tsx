import { ChangeEvent } from 'react'
import classNames from 'classnames'
import { Select } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import { createUseStyles } from 'react-jss'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import useCommonStyle from 'styles/useCommonStyle'
import BehaviorLabel from './BehaviorLabel'

const useStyles = createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  container: {
    margin: '1rem',
    paddingLeft: '1rem',
    borderLeft: `2px solid ${theme.SecondaryColor}`,
  },
  desc: {
    margin: '0 0.5rem !important',
  },
  select: {
    marginTop: '0.5rem',
  },
}))

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

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

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
        behavior={behavior}
        color={hasValue ? 'info' : 'gray'}
        value={behaviorValue}
        onClick={handleClick}
      />
    )
  }

  return (
    <div
      data-testid='behaviorEditor'
      className={classNames(
        commonClasses.columnStart,
        classes.container,
        'w-full',
      )}
    >
      <div className={commonClasses.rowStart}>
        <BehaviorLabel
          behavior={behavior}
          color='indigo'
          onClick={handleClick}
        />
        <h5 className={classes.desc}>
          {parseTool.behaviorDesc(behavior)}
        </h5>
      </div>
      <Select
        data-testid='select'
        className={classNames(classes.select, 'w-64')}
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
    </div>
  )
}

export default BehaviorEditor
