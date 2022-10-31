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
import { context } from 'context'
import useStore from 'states/store'
import { MemoryHistory } from 'history'
import { store as reduxStore } from 'stores'
import { Provider } from 'react-redux'

const WithStoreProvider = ({
  children,
  disabled = false,
  store = {},
}: {
  disabled?: boolean;
  children?: ReactNode;
  store?: object;
}) => {
  const defaultStore = useStore({
    // @ts-ignore
    initCommon: store?.common,
    // @ts-ignore
    initResources: store?.resources,
    // @ts-ignore
    initTraderBehaviors: store?.traderBehaviors,
    // @ts-ignore
    initTraderEnvs: store?.traderEnvs,
    // @ts-ignore
    initTraderCombos: store?.traderCombos,
    // @ts-ignore
    initTraderProfiles: store?.traderProfiles,
    // @ts-ignore
    initTraderTickers: store?.traderTickers,
  })

  if (disabled) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <context.Provider value={defaultStore}>
      {children}
    </context.Provider>
  )
}

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
  store,
  history,
}: {
  children: ReactNode;
  store?: object;
  history?: MemoryHistory;
}) => {
  return (
    <WithRouterProvider history={history}>
      <Provider store={reduxStore}>
        <WithStoreProvider store={store}>
          {children}
        </WithStoreProvider>
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
  store,
  disableStore = false,
}: {
  children?: ReactNode;
  history?: MemoryHistory;
  store?: object;
  reduxStore?: object;
  disableStore?: boolean;
}) => {
  return (
    <WithRouterProvider history={history}>
      <Provider store={reduxStore}>
        <WithStoreProvider
          store={store}
          disabled={disableStore}
        >
          {children}
        </WithStoreProvider>
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
