import { BrowserRouter, Router } from 'react-router-dom'
import { ReactNode, ReactElement } from 'react'
import {
  render as defaultRender,
  screen,
  fireEvent,
  waitFor,
  renderHook as defaultRenderHook,
  act,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryHistory } from 'history'
import { store as reduxStore } from 'stores'
import { Provider } from 'react-redux'

const WithRouterProvider = ({
  children,
  history,
}: {
  children: ReactNode;
  history?: MemoryHistory;
}) => {
  if (!history) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    )
  }

  return (
    <Router
      location={history?.location}
      navigator={history}
    >
      {children}
    </Router>
  )
}

const InterfaceBase = ({
  children,
  history,
}: {
  children: ReactNode;
  store?: object;
  history?: MemoryHistory;
}) => {
  return (
    <WithRouterProvider history={history}>
      <Provider store={reduxStore}>
        {children}
      </Provider>
    </WithRouterProvider>
  )
}

const render = (
  ui: ReactElement,
  options?: object,
) => defaultRender(ui, {
  wrapper: (props) => (
    <InterfaceBase
      {...props}
      {...options}
    />
  ),
})

const HookBase = ({
  children,
  history,
}: {
  children?: ReactNode;
  history?: MemoryHistory;
}) => {
  return (
    <WithRouterProvider history={history}>
      <Provider store={reduxStore}>
        {children}
      </Provider>
    </WithRouterProvider>
  )
}

const renderHook = (
  hook: () => any,
  options?: object,
) => defaultRenderHook(hook, {
  wrapper: (props) => (
    <HookBase
      {...props}
      {...options}
    />
  ),
})

export {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  renderHook,
}
