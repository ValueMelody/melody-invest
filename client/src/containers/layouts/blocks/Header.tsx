import * as interfaces from '@shared/interfaces'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserState from 'states/useUserState'
import useCommonStyle from 'styles/useCommonStyle'
import HeaderLink from 'containers/layouts/elements/HeaderLink'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  header: {
    height: '3rem',
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: theme.PrimaryColor,
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
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const { getUser } = useUserState()
  const user = getUser()

  // ------------------------------------------------------------ UI --

  return (
    <header className={vendorTool.classNames(
      commonClasses.rowBetween,
      classes.header,
    )}>
      <nav>
        <HeaderLink
          route={routerTool.topProfilesRoute()}
          title={localeTool.t('topProfiles.title')}
          icon='chart line'
        />
        <HeaderLink
          route={routerTool.topCombosRoute()}
          title={localeTool.t('topCombos.title')}
          icon='boxes'
        />
        <HeaderLink
          route={routerTool.behaviorListRoute()}
          title={localeTool.t('tradeBehaviors.title')}
          icon='certificate'
        />
        <HeaderLink
          route={routerTool.tickerListRoute()}
          title={localeTool.t('availableTickers.title')}
          icon='ticket'
        />
      </nav>
      <nav>
        {user.hasLogin && (
          <HeaderLink
            route={routerTool.dashboardRoute()}
            title={localeTool.t('dashboard.title')}
            icon='table'
          />
        )}
        <HeaderLink
          route={user.hasLogin ? routerTool.settingRoute() : routerTool.signInRoute()}
          icon='user circle'
        />
      </nav>
    </header>
  )
}

export default Header
