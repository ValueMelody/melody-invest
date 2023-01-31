import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import { Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen } from 'test.utils'
import Home from './Home'
import { createMemoryHistory } from 'history'

describe('#Home', () => {
  test('could redirect correctly', () => {
    const history = createMemoryHistory({ initialEntries: [routerEnum.Nav.Root] })
    render(
      <Routes>
        <Route
          path={routerEnum.Nav.Root}
          element={<Home />}
        />
      </Routes>,
      { history },
    )
    const button = screen.getByTestId('signUpBtn')
    fireEvent.click(button)
    expect(history.location.pathname).toBe(routerTool.signUpRoute())

    const behaviorButton = screen.getByTestId('behaviorsBtn')
    fireEvent.click(behaviorButton)
    expect(history.location.pathname).toBe(routerTool.behaviorListRoute())

    const stockButton = screen.getByTestId('stocksBtn')
    fireEvent.click(stockButton)
    expect(history.location.pathname).toBe(routerTool.tickerListRoute())
  })
})
