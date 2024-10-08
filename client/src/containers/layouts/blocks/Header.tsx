import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import {
  ArrowLeftIcon, Bars3Icon, BookmarkIcon, HomeIcon,
  TableCellsIcon, TicketIcon, UserCircleIcon,
} from '@heroicons/react/24/solid'
import { Button, Sidebar } from 'flowbite-react'
import HeaderLink from 'containers/layouts/elements/HeaderLink'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const headerClass = 'mx-2'

const LeftLinks = ({
  onClick,
}: {
  onClick?: () => void;
}) => {
  const global = useSelector(selectors.selectGlobal())
  const location = useLocation()

  return (
    <>
      <HeaderLink
        isActive={location.pathname === routerTool.rootRoute()}
        className={headerClass}
        route={routerTool.rootRoute()}
        icon={HomeIcon}
        onClick={onClick}
      />
      <HeaderLink
        isActive={location.pathname === routerTool.behaviorListRoute()}
        className={headerClass}
        route={routerTool.behaviorListRoute()}
        title={localeTool.t('tradeBehaviors.title')}
        icon={BookmarkIcon}
        onClick={onClick}
      />
      {!!global.refreshToken && (
        <HeaderLink
          isActive={location.pathname === routerTool.tickerListRoute()}
          className={headerClass}
          route={routerTool.tickerListRoute()}
          title={localeTool.t('availableTickers.title')}
          icon={TicketIcon}
          onClick={onClick}
        />
      )}
    </>
  )
}

const RightLinks = ({
  onClick,
}: {
  onClick?: () => void;
}) => {
  const global = useSelector(selectors.selectGlobal())
  const location = useLocation()

  return (
    <>
      {!!global.refreshToken && (
        <HeaderLink
          isActive={location.pathname === routerTool.dashboardRoute()}
          className={headerClass}
          route={routerTool.dashboardRoute()}
          title={localeTool.t('dashboard.title')}
          icon={TableCellsIcon}
          onClick={onClick}
        />
      )}
      <HeaderLink
        isActive={location.pathname === routerTool.settingRoute()}
        className={headerClass}
        data-testid='user'
        route={global.refreshToken ? routerTool.settingRoute() : routerTool.signInRoute()}
        icon={UserCircleIcon}
        onClick={onClick}
      />
    </>
  )
}

const navClass = 'flex items-center max-lg:invisible'

const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false)

  const handleCloseSideBar = () => {
    setShowSideBar(false)
  }

  const handleOpenSideBar = () => {
    setShowSideBar(true)
  }

  return (
    <>
      <header
        data-testid='header'
        className='fixed h-12 z-50 flex justify-between items-center w-full bg-primary top-0 px-4'
      >
        <Button
          data-testid='sideBarBtn'
          className='lg:hidden'
          size='sm'
          color='gray'
          onClick={handleOpenSideBar}
        >
          <Bars3Icon className='icon-size' />
        </Button>
        <nav className={navClass}>
          <LeftLinks />
        </nav>
        <nav className={navClass}>
          <RightLinks />
        </nav>
      </header>
      {showSideBar && (
        <Sidebar
          data-testid='sideBar'
          className='fixed top-0 bottom-0 z-50'
        >
          <div className='flex'>
            <Button
              size='sm'
              data-testid='closeSideBarBtn'
              onClick={handleCloseSideBar}
            >
              <ArrowLeftIcon className='icon-size mr-2' />
              {localeTool.t('header.close')}
            </Button>
          </div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <LeftLinks onClick={handleCloseSideBar} />
              <RightLinks onClick={handleCloseSideBar} />
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      )}
    </>
  )
}

export default Header
