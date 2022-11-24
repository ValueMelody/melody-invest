import { Badge } from 'flowbite-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const HeaderLink = ({
  isActive = false,
  title,
  route,
  icon,
  'data-testid': dataTestId,
  className,
}: {
  isActive?: boolean;
  title?: string;
  route: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  ['data-testid']?: string;
  className?: string;
}) => {
  return (
    <Link
      to={route}
      data-testid={dataTestId}
      className={classNames(className)}
    >
      <Badge
        className='cursor-pointer'
        color={isActive ? 'gray' : 'info'}
        size='sm'
        icon={icon}
      >
        {title || ''}
      </Badge>
    </Link>
  )
}

export default HeaderLink
