import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import BehaviorLabel from './BehaviorLabel'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  container: {
    margin: '1rem',
    paddingLeft: '1rem',
    borderLeft: `2px solid ${theme.SECONDARY_COLOR}`,
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
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const options = constants.behaviorValue.options[behavior]
  const hasValue = behaviorValue !== null && options.includes(behaviorValue)
  const selectOptions = options.map((option) => ({
    key: option, value: option, text: parseTool.behaviorValue(behavior, option),
  }))

  // ------------------------------------------------------------ Handler --

  const handleClick = () => onClick(behavior)

  const handleSelect = (
    e: vendorTool.react.SyntheticEvent,
    data: vendorTool.ui.DropdownProps,
  ) => {
    const value = data.value === '' ? null : Number(data.value)
    onSelect(behavior, value)
  }

  // ------------------------------------------------------------ Interface --

  if (!isEditing) {
    return (
      <BehaviorLabel
        behavior={behavior}
        color={hasValue ? 'blue' : 'grey'}
        value={behaviorValue}
        onClick={handleClick}
      />
    )
  }

  return (
    <div className={vendorTool.classNames('column-start', classes.container)}>
      <div className='row-start'>
        <BehaviorLabel
          behavior={behavior}
          color='black'
          onClick={handleClick}
        />
        <h5 className={classes.desc}>
          {parseTool.behaviorDesc(behavior)}
        </h5>
      </div>
      <vendorTool.ui.Dropdown
        selection
        clearable
        className={classes.select}
        placeholder={localeTool.t('profileBuilder.select')}
        options={selectOptions}
        value={behaviorValue || ''}
        onChange={handleSelect}
      />
    </div>
  )
}

export default BehaviorEditor
