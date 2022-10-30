import { Button } from 'flowbite-react'
import { PlusIcon } from '@heroicons/react/24/solid'

const AddButton = ({
  onClick,
  disabled = false,
  title,
  tooltip,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  tooltip?: string;
}) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      title={tooltip}
    >
      <PlusIcon className='w-4 h-4 mr-4' />
      {title}
    </Button>
  )
}

export default AddButton