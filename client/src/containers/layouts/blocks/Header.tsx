import { Link } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Icon, Label } from 'semantic-ui-react'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import useUserState from '../../../states/useUserState'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  header: {
    height: '3rem',
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: theme.PRIMARY_COLOR,
    paddingLeft: '1rem',
    paddingRight: '1rem',
    zIndex: 1000,
  },
  label: {
    marginLeft: '0.5rem !important',
    marginRight: '0.5rem !important',
  },
  icon: {
    marginRight: '0.5rem !important',
  },
}))

const Header = () => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()
  const isLoggedInUser = !!user.userType

  // ------------------------------------------------------------ Interface --

  return (
    <header className={classNames('row-between', classes.header)}>
      <nav>
        <Link to={routerTool.topProfilesRoute()}>
          <Label className={classes.label}>
            <Icon name='chart line' className={classes.icon} />
            {localeTool.t('topProfiles.title')}
          </Label>
        </Link>
        <Link to={routerTool.behaviorListRoute()}>
          <Label className={classes.label}>
            <Icon name='certificate' className={classes.icon} />
            {localeTool.t('tradeBehaviors.title')}
          </Label>
        </Link>
        <Link to={routerTool.tickerListRoute()}>
          <Label className={classes.label}>
            <Icon name='ticket' className={classes.icon} />
            {localeTool.t('availableTickers.title')}
          </Label>
        </Link>
      </nav>
      <nav>
        {isLoggedInUser && (
          <Link to={routerTool.dashboardRoute()}>
            <Label className={classes.label}>
              <Icon name='table' className={classes.icon} />
              {localeTool.t('dashboard.title')}
            </Label>
          </Link>
        )}
        <Link to={isLoggedInUser ? routerTool.settingRoute() : routerTool.signInRoute()}>
          <Label className={classes.label}>
            <Icon name='user circle' />
          </Label>
        </Link>
      </nav>
    </header>
  )
}

export default Header
