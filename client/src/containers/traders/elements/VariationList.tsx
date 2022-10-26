import classNames from 'classnames'
import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import useCommonStyle from 'styles/useCommonStyle'

type Value = string | number

interface Option {
  value: Value;
  label: string;
  onClick: (value?: Value) => void;
}

const useStyles = createUseStyles(({
  label: {
    marginTop: '1rem !important',
    width: '100%',
    minWidth: 160,
  },
  active: {
    marginLeft: '0 !important',
  },
}))

const VariationList = ({
  options,
  activeValue,
}: {
  options: Option[];
  activeValue: Value;
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  // ------------------------------------------------------------ UI --

  return (
    <section data-testid='variationList' className={commonClasses.columnStart}>
      {options.map((option) => {
        const handleClick = () => {
          option.onClick(option.value)
        }

        return (
          <Label
            key={option.value}
            className={classNames(
              classes.label,
              commonClasses.cursorClickable,
              { [classes.active]: option.value === activeValue })}
            pointing={option.value === activeValue ? 'left' : undefined}
            color={option.value === activeValue ? 'blue' : undefined}
            onClick={handleClick}
          >
            {option.label}
          </Label>
        )
      })}
    </section>
  )
}

export default VariationList
