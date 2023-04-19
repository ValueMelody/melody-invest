import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import { fireEvent, render, screen } from 'test.utils'
import Header from './Header'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

afterEach(() => {
  jest.clearAllMocks()
})

describe('#Header', () => {
  test('could render common Header', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(<Header />, { history })

    const behaviorsText = localeTool.t('tradeBehaviors.title')
    const behaviorsButton = screen.getByText(behaviorsText)
    fireEvent.click(behaviorsButton)
    expect(history.location.pathname).toBe(routerTool.behaviorListRoute())
  })

  test('could render as guest', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(<Header />, { history })

    const dashboardText = localeTool.t('dashboard.title')
    const dashboardButton = screen.queryByText(dashboardText)
    expect(dashboardButton).toBeFalsy()

    const userButton = screen.queryByTestId('user')
    fireEvent.click(userButton!)
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('could render as loggedin user', () => {
    store.dispatch(globalSlice.actions._updateForTest({ refreshToken: '123' }))
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(<Header />, { history })

    const tickersText = localeTool.t('availableTickers.title')
    const tickersButton = screen.getByText(tickersText)
    fireEvent.click(tickersButton)
    expect(history.location.pathname).toBe(routerTool.tickerListRoute())

    const dashboardText = localeTool.t('dashboard.title')
    const dashboardButton = screen.queryByText(dashboardText)
    expect(dashboardButton).toBeTruthy()
    fireEvent.click(dashboardButton!)
    expect(history.location.pathname).toBe(routerTool.dashboardRoute())

    const userButton = screen.queryByTestId('user')
    fireEvent.click(userButton!)
    expect(history.location.pathname).toBe(routerTool.settingRoute())
  })

  test('mobile header', () => {
    jest.spyOn(window.screen, 'width', 'get').mockReturnValue(350)
    render(<Header />)
    expect(screen.queryByTestId('sideBar')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('sideBarBtn'))
    expect(screen.queryByTestId('sideBar')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('closeSideBarBtn'))
    expect(screen.queryByTestId('sideBar')).not.toBeInTheDocument()
  })
})
