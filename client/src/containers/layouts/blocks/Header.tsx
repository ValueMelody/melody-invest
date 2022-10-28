import classNames from 'classnames'
import * as interfaces from '@shared/interfaces'
import {
  ChartBarIcon, ArchiveBoxIcon, BookmarkIcon,
  TicketIcon, TableCellsIcon, UserCircleIcon,
} from '@heroicons/react/24/solid'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useUserState from 'states/useUserState'
import useCommonStyle from 'styles/useCommonStyle'
import HeaderLink from 'containers/layouts/elements/HeaderLink'

const useStyles = createUseStyles((
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
    <header
      data-testid='header'
      className={classNames(
        commonClasses.rowBetween,
        classes.header,
      )}
    >
      <nav className='flex'>
        <HeaderLink
          route={routerTool.topProfilesRoute()}
          title={localeTool.t('topProfiles.title')}
          icon={ChartBarIcon}
        />
        <HeaderLink
          route={routerTool.topCombosRoute()}
          title={localeTool.t('topCombos.title')}
          icon={ArchiveBoxIcon}
        />
        <HeaderLink
          route={routerTool.behaviorListRoute()}
          title={localeTool.t('tradeBehaviors.title')}
          icon={BookmarkIcon}
        />
        <HeaderLink
          route={routerTool.tickerListRoute()}
          title={localeTool.t('availableTickers.title')}
          icon={TicketIcon}
        />
      </nav>
      <nav className='flex items-center'>
        {user.hasLogin && (
          <HeaderLink
            route={routerTool.dashboardRoute()}
            title={localeTool.t('dashboard.title')}
            icon={TableCellsIcon}
          />
        )}
        <HeaderLink
          data-testid='user'
          route={user.hasLogin ? routerTool.settingRoute() : routerTool.signInRoute()}
          icon={UserCircleIcon}
        />
      </nav>
    </header>
  )
}

export default Header
