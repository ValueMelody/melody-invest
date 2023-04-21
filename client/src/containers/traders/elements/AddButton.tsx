import { Button } from 'flowbite-react'
import { PlusIcon } from '@heroicons/react/24/solid'

const AddButton = ({
  onClick,
  disabled = false,
  title,
  tooltip,
  className,
  'data-testid': testId,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  tooltip?: string;
  className?: string;
  ['data-testid']?: string;
}) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <Button
      className='ml-6'
      size='xs'
      data-testid={testId}
      onClick={handleClick}
      disabled={disabled}
      title={tooltip}
    >
      <PlusIcon className='icon-size mr-4' />
      {title}
    </Button>
  )
}

export default AddButton
