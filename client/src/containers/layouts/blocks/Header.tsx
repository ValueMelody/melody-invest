import {
  ChartBarIcon, ArchiveBoxIcon, BookmarkIcon,
  TicketIcon, TableCellsIcon, UserCircleIcon,
} from '@heroicons/react/24/solid'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import HeaderLink from 'containers/layouts/elements/HeaderLink'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const navClass = 'flex items-center'
const headerClass = 'mx-2'

const Header = () => {
  const user = useSelector(selectors.selectUser())

  return (
    <header
      data-testid='header'
      className='fixed h-12 z-50 flex justify-between w-full bg-primary top-0 px-4'
    >
      <nav className={navClass}>
        <HeaderLink
          className={headerClass}
          route={routerTool.topProfilesRoute()}
          title={localeTool.t('topProfiles.title')}
          icon={ChartBarIcon}
        />
        <HeaderLink
          className={headerClass}
          route={routerTool.topCombosRoute()}
          title={localeTool.t('topCombos.title')}
          icon={ArchiveBoxIcon}
        />
        <HeaderLink
          className={headerClass}
          route={routerTool.behaviorListRoute()}
          title={localeTool.t('tradeBehaviors.title')}
          icon={BookmarkIcon}
        />
        <HeaderLink
          className={headerClass}
          route={routerTool.tickerListRoute()}
          title={localeTool.t('availableTickers.title')}
          icon={TicketIcon}
        />
      </nav>
      <nav className={navClass}>
        {user.hasLogin && (
          <HeaderLink
            className={headerClass}
            route={routerTool.dashboardRoute()}
            title={localeTool.t('dashboard.title')}
            icon={TableCellsIcon}
          />
        )}
        <HeaderLink
          className={headerClass}
          data-testid='user'
          route={user.hasLogin ? routerTool.settingRoute() : routerTool.signInRoute()}
          icon={UserCircleIcon}
        />
      </nav>
    </header>
  )
}

export default Header
