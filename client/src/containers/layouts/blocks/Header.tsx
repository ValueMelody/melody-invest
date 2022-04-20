import * as themeEnum from '../../../enums/theme'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import useUserState from '../../../states/useUserState'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
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

  // ------------------------------------------------------------ UI --

  return (
    <header className={vendorTool.classNames('row-between', classes.header)}>
      <nav>
        <vendorTool.router.Link to={routerTool.topProfilesRoute()}>
          <vendorTool.ui.Label className={classes.label}>
            <vendorTool.ui.Icon name='chart line' className={classes.icon} />
            {localeTool.t('topProfiles.title')}
          </vendorTool.ui.Label>
        </vendorTool.router.Link>
        <vendorTool.router.Link to={routerTool.topCombosRoute()}>
          <vendorTool.ui.Label className={classes.label}>
            <vendorTool.ui.Icon name='boxes' className={classes.icon} />
            {localeTool.t('topCombos.title')}
          </vendorTool.ui.Label>
        </vendorTool.router.Link>
        <vendorTool.router.Link to={routerTool.behaviorListRoute()}>
          <vendorTool.ui.Label className={classes.label}>
            <vendorTool.ui.Icon name='certificate' className={classes.icon} />
            {localeTool.t('tradeBehaviors.title')}
          </vendorTool.ui.Label>
        </vendorTool.router.Link>
        <vendorTool.router.Link to={routerTool.tickerListRoute()}>
          <vendorTool.ui.Label className={classes.label}>
            <vendorTool.ui.Icon name='ticket' className={classes.icon} />
            {localeTool.t('availableTickers.title')}
          </vendorTool.ui.Label>
        </vendorTool.router.Link>
      </nav>
      <nav>
        {isLoggedInUser && (
          <vendorTool.router.Link to={routerTool.dashboardRoute()}>
            <vendorTool.ui.Label className={classes.label}>
              <vendorTool.ui.Icon name='table' className={classes.icon} />
              {localeTool.t('dashboard.title')}
            </vendorTool.ui.Label>
          </vendorTool.router.Link>
        )}
        <vendorTool.router.Link to={isLoggedInUser ? routerTool.settingRoute() : routerTool.signInRoute()}>
          <vendorTool.ui.Label className={classes.label}>
            <vendorTool.ui.Icon name='user circle' />
          </vendorTool.ui.Label>
        </vendorTool.router.Link>
      </nav>
    </header>
  )
}

export default Header
