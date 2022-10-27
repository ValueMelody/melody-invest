import { BrowserRouter, Router } from 'react-router-dom'
import { FC, ReactNode, ReactElement } from 'react'
import { ThemeProvider } from 'react-jss'
import {
  render as defaultRender,
  screen,
  fireEvent,
  waitFor,
  renderHook as defaultRenderHook,
  act,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import * as themeEnum from './enums/theme'
import { context } from 'context'
import useStore from 'states/store'
import { MemoryHistory } from 'history'

const WithThemeProvider: FC = ({ children }) => {
  return (
      <ThemeProvider theme={themeEnum.theme}>
        {children}
      </ThemeProvider>
  )
}

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
    <Router location={history?.location} navigator={history}>
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
      <WithThemeProvider>
        <WithStoreProvider store={store}>
          {children}
        </WithStoreProvider>
      </WithThemeProvider>
    </WithRouterProvider>
  )
}

const render = (
  ui: ReactElement,
  options?: object,
) => defaultRender(ui, {
  wrapper: (props) => <InterfaceBase {...props} {...options} />,
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
  disableStore?: boolean;
}) => {
  return (
    <WithRouterProvider history={history}>
      <WithStoreProvider store={store} disabled={disableStore}>
        <WithThemeProvider>
          {children}
        </WithThemeProvider>
      </WithStoreProvider>
    </WithRouterProvider>
  )
}

const renderHook = (
  hook: () => any,
  options?: object,
) => defaultRenderHook(hook, {
  wrapper: (props) => <HookBase {...props} {...options} />,
})

export {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  renderHook,
}
