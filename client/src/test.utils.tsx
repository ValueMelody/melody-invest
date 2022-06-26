import {
  render as defaultRender,
  screen,
  fireEvent,
} from '@testing-library/react'
import {
  renderHook as defaultRenderHook,
  act,
} from '@testing-library/react-hooks'
import '@testing-library/jest-dom'
import * as vendorTool from './tools/vendor'
import * as themeEnum from './enums/theme'
import { context } from 'context'
import useStore from 'states/store'
import { useEffect } from 'react'
import { MemoryHistory } from 'history'

const WithThemeProvider: vendorTool.react.FC = ({ children }) => {
  return (
      <vendorTool.jss.ThemeProvider theme={themeEnum.theme}>
        {children}
      </vendorTool.jss.ThemeProvider>
  )
}

const WithStoreProvider = ({
  children,
  disabled = false,
  store = {},
}: {
  disabled?: boolean;
  children?: vendorTool.react.ReactNode;
  store?: object;
}) => {
  const defaultStore = useStore()

  useEffect(() => {
    // @ts-ignore
    if (store.resources) defaultStore.setResources(store.resources)
    // @ts-ignore
    if (store.common) defaultStore.setCommon(store.common)
    // @ts-ignore
    if (store.traderProfiles) defaultStore.setTraderProfiles(store.traderProfiles)
    // @ts-ignore
    if (store.traderCombos) defaultStore.setTraderCombos(store.traderCombos)
    // @ts-ignore
    if (store.traderEnvs) defaultStore.setTraderEnvs(store.traderEnvs)
    // @ts-ignore
    if (store.traderTickers) defaultStore.setTraderTickers(store.traderTickers)
    // @ts-ignore
    if (store.traderBehaviors) defaultStore.setTraderBehaviors(store.traderBehaviors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  children: vendorTool.react.ReactNode;
  history?: MemoryHistory;
}) => {
  if (!history) {
    return (
      <vendorTool.router.BrowserRouter>
        {children}
      </vendorTool.router.BrowserRouter>
    )
  }

  return (
    <vendorTool.router.Router location={history?.location} navigator={history}>
      {children}
    </vendorTool.router.Router>
  )
}

const InterfaceBase = ({
  children,
  store,
}: {
  children: vendorTool.react.ReactNode;
  store?: object;
}) => {
  return (
    <WithRouterProvider>
      <WithThemeProvider>
        <WithStoreProvider store={store}>
          {children}
        </WithStoreProvider>
      </WithThemeProvider>
    </WithRouterProvider>
  )
}

export const render = (
  ui: vendorTool.react.ReactElement,
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
  children?: vendorTool.react.ReactNode;
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

export const renderHook = (
  hook: () => any,
  options?: object,
) => defaultRenderHook(hook, {
  wrapper: (props) => <HookBase {...props} {...options} />,
})

export {
  screen, fireEvent, act,
}
