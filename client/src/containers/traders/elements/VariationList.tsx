import * as vendorTool from '../../../tools/vendor'

type Value = string | number

interface Option {
  value: Value;
  label: string;
  onClick: (value?: Value) => void;
}

const useStyles = vendorTool.jss.createUseStyles(({
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
  const classes = useStyles()

  // ------------------------------------------------------------ Interface --

  return (
    <section data-testid='variationList' className='column-start'>
      {options.map((option) => {
        const handleClick = () => {
          option.onClick(option.value)
        }

        return (
          <vendorTool.ui.Label
            key={option.value}
            className={vendorTool.classNames(
              classes.label,
              'click-cursor',
              { [classes.active]: option.value === activeValue })}
            pointing={option.value === activeValue ? 'left' : undefined}
            color={option.value === activeValue ? 'blue' : undefined}
            onClick={handleClick}
          >
            {option.label}
          </vendorTool.ui.Label>
        )
      })}
    </section>
  )
}

export default VariationList
