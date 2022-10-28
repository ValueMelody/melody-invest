import { ListGroup } from 'flowbite-react'

type Value = string | number

interface Option {
  value: Value;
  label: string;
  onClick: (value?: Value) => void;
}

const VariationList = ({
  options,
  activeValue,
}: {
  options: Option[];
  activeValue: Value;
}) => {
  // ------------------------------------------------------------ UI --

  return (
    <ListGroup data-testid='variationList'>
      {options.map((option) => {
        const handleClick = () => {
          option.onClick(option.value)
        }

        return (
          <ListGroup.Item
            key={option.value}
            active={option.value === activeValue}
            onClick={handleClick}
          >
            <h4 className='m-6'>{option.label}</h4>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}

export default VariationList
