import * as vendorTool from '../../../tools/vendor'

type Value = string | number

interface Option {
  value: Value;
  label: string;
  onClick: (value: Value) => {};
}

const useStyles = vendorTool.jss.createUseStyles(({
  active: {
    border: '1px solid black',
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
    <section className='column-start'>
      {options.map((option) => {
        const handleClick = () => {
          option.onClick(option.value)
        }

        return (
          <vendorTool.ui.Label
            basic
            key={option.value}
            className={vendorTool.classNames({
              [classes.active]: option.value === activeValue,
            })}
            pointing='left'
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
