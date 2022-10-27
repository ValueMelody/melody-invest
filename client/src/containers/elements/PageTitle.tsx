import classNames from 'classnames'
import { StarIcon } from '@heroicons/react/24/solid'

const PageTitle = ({
  className,
  title,
}: {
  className?: string;
  title: string;
}) => {
  return (
    <h3 className={classNames(className, 'flex items-center')}>
      <StarIcon className='mr-2 w-4 h-4' />
      {title}
    </h3>
  )
}

export default PageTitle
