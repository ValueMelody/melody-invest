import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { Tooltip } from 'flowbite-react'

const Info = ({
  title,
}: {
  title: string;
}) => {
  return (
    <Tooltip content={title}>
      <InformationCircleIcon className='w-6 h-6 fill-blue-500' />
    </Tooltip>
  )
}

export default Info
