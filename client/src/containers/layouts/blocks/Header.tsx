import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import {
  ArchiveBoxIcon, BookmarkIcon, ChartBarIcon, HomeIcon,
  TableCellsIcon, TicketIcon, UserCircleIcon,
} from '@heroicons/react/24/solid'
import HeaderLink from 'containers/layouts/elements/HeaderLink'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const navClass = 'flex items-center'
const headerClass = 'mx-2'

const Header = () => {
  const global = useSelector(selectors.selectGlobal())
  const location = useLocation()

  return (
    <header
      data-testid='header'
      className='fixed h-12 z-50 flex justify-between w-full bg-primary top-0 px-4'
    >
      <nav className={navClass}>
        <HeaderLink
          isActive={location.pathname === routerTool.homeRoute()}
          className={headerClass}
          route={routerTool.homeRoute()}
          icon={HomeIcon}
        />
        <HeaderLink
          isActive={location.pathname === routerTool.topProfilesRoute()}
          className={headerClass}
          route={routerTool.topProfilesRoute()}
          title={localeTool.t('topProfiles.title')}
          icon={ChartBarIcon}
        />
        <HeaderLink
          isActive={location.pathname === routerTool.topCombosRoute()}
          className={headerClass}
          route={routerTool.topCombosRoute()}
          title={localeTool.t('topCombos.title')}
          icon={ArchiveBoxIcon}
        />
        <HeaderLink
          isActive={location.pathname === routerTool.behaviorListRoute()}
          className={headerClass}
          route={routerTool.behaviorListRoute()}
          title={localeTool.t('tradeBehaviors.title')}
          icon={BookmarkIcon}
        />
        <HeaderLink
          isActive={location.pathname === routerTool.tickerListRoute()}
          className={headerClass}
          route={routerTool.tickerListRoute()}
          title={localeTool.t('availableTickers.title')}
          icon={TicketIcon}
        />
      </nav>
      <nav className={navClass}>
        {!!global.refreshToken && (
          <HeaderLink
            isActive={location.pathname === routerTool.dashboardRoute()}
            className={headerClass}
            route={routerTool.dashboardRoute()}
            title={localeTool.t('dashboard.title')}
            icon={TableCellsIcon}
          />
        )}
        <HeaderLink
          isActive={location.pathname === routerTool.settingRoute()}
          className={headerClass}
          data-testid='user'
          route={global.refreshToken ? routerTool.settingRoute() : routerTool.signInRoute()}
          icon={UserCircleIcon}
        />
      </nav>
    </header>
  )
}

export default Header
