import { Button } from 'flowbite-react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

const GoToButton = ({
  onClick,
  title,
  className,
  'data-testid': dataTestId,
}: {
  title: string;
  onClick: () => void;
  className?: string;
  ['data-testid']?: string;
}) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <Button
      data-testid={dataTestId}
      className={className}
      onClick={handleClick}
      color='gray'
      pill
    >
      {title}
      <ArrowRightIcon className='ml-2 h-5 w-5' />
    </Button>
  )
}

export default GoToButton
