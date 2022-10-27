import { createMemoryHistory } from 'history'
import Header from './Header'
import { fireEvent, render, screen } from 'test.utils'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'

describe('#Header', () => {
  test('could render common Header', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    render(<Header />, { history })

    const topProfilesText = localeTool.t('topProfiles.title')
    const topProfilesButton = screen.getByText(topProfilesText)
    fireEvent.click(topProfilesButton)
    expect(history.location.pathname).toBe(routerTool.topProfilesRoute())

    const topCombosText = localeTool.t('topCombos.title')
    const topCombosButton = screen.getByText(topCombosText)
    fireEvent.click(topCombosButton)
    expect(history.location.pathname).toBe(routerTool.topCombosRoute())

    const behaviorsText = localeTool.t('tradeBehaviors.title')
    const behaviorsButton = screen.getByText(behaviorsText)
    fireEvent.click(behaviorsButton)
    expect(history.location.pathname).toBe(routerTool.behaviorListRoute())

    const tickersText = localeTool.t('availableTickers.title')
    const tickersButton = screen.getByText(tickersText)
    fireEvent.click(tickersButton)
    expect(history.location.pathname).toBe(routerTool.tickerListRoute())
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
    const history = createMemoryHistory({ initialEntries: ['/test'] })
    const store = {
      resources: {
        hasLogin: true,
        userTraderIds: [],
      },
    }

    render(<Header />, { history, store })

    const dashboardText = localeTool.t('dashboard.title')
    const dashboardButton = screen.queryByText(dashboardText)
    expect(dashboardButton).toBeTruthy()
    fireEvent.click(dashboardButton!)
    expect(history.location.pathname).toBe(routerTool.dashboardRoute())

    const userButton = screen.queryByTestId('user')
    fireEvent.click(userButton!)
    expect(history.location.pathname).toBe(routerTool.settingRoute())
  })
})
