import { FC } from 'react'
import { Badge } from 'flowbite-react'
import { Link } from 'react-router-dom'

const HeaderLink = ({
  title,
  route,
  icon,
  'data-testid': dataTestId,
  className,
}: {
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
      className={className}
    >
      <Badge
        className='cursor-pointer'
        color='gray'
        size='sm'
        icon={icon}
      >
        {title || ''}
      </Badge>
    </Link>
  )
}

export default HeaderLink
