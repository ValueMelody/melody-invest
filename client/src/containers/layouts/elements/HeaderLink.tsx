import classNames from 'classnames'
import { SemanticICONS, Label, Icon } from 'semantic-ui-react'
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
}: {
  title?: string,
  route: string,
  icon: SemanticICONS,
}) => {
  // ------------------------------------------------------------ State --
  const classes = useStyles()

  return (
    <Link to={route}>
      <Label className={classes.label}>
        <Icon
          name={icon}
          className={classNames({ [classes.icon]: !!title })}
        />
        {title || ''}
      </Label>
    </Link>
  )
}

export default HeaderLink
