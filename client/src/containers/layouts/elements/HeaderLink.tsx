import classNames from 'classnames'
import { FC } from 'react'
import { Badge } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  label: {
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
  },
  icon: {
    marginRight: '0.5rem !important',
  },
})

const HeaderLink = ({
  title,
  route,
  icon,
  'data-testid': dataTestId,
}: {
  title?: string;
  route: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  ['data-testid']?: string;
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()

  return (
    <Link to={route} data-testid={dataTestId}>
      <Badge
        className={classNames(classes.label, 'cursor-pointer')}
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
