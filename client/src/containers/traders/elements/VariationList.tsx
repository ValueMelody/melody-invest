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
  return (
    <ListGroup data-testid='variationList'>
      {options.map((option) => {
        const handleClick = () => {
          option.onClick(option.value)
        }

        return (
          <ListGroup.Item
            data-testid={`variant${option.value}`}
            key={option.value}
            active={option.value === activeValue}
            onClick={handleClick}
          >
            <h2 className='m-2'>{option.label}</h2>
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}

export default VariationList
