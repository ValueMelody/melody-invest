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

const WithThemeProvider: vendorTool.react.FC = ({ children }) => {
  return (
      <vendorTool.jss.ThemeProvider theme={themeEnum.theme}>
        {children}
      </vendorTool.jss.ThemeProvider>
  )
}

const WithStoreProvider = ({
  children,
  store = {},
}: {
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

  return (
    <context.Provider value={defaultStore}>
      {children}
    </context.Provider>
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
    <vendorTool.router.BrowserRouter>
      <WithThemeProvider>
        <WithStoreProvider store={store}>
          {children}
        </WithStoreProvider>
      </WithThemeProvider>
    </vendorTool.router.BrowserRouter>
  )
}

interface RenderOptions {
  wrapperProps?: object;
}

export const render = (
  ui: vendorTool.react.ReactElement,
  options?: RenderOptions,
) => defaultRender(ui, {
  wrapper: (props) => <InterfaceBase {...props} {...options?.wrapperProps} />,
})

const HookBase = ({
  children,
  store,
}: {
  children?: vendorTool.react.ReactNode,
  store?: object,
}) => {
  return (
    <vendorTool.router.BrowserRouter>
      <WithStoreProvider store={store}>
        <WithThemeProvider>
          {children}
        </WithThemeProvider>
      </WithStoreProvider>
    </vendorTool.router.BrowserRouter>
  )
}

export const renderHook = (
  hook: () => any,
  options?: RenderOptions,
) => defaultRenderHook(hook, {
  wrapper: (props) => <HookBase {...props} {...options?.wrapperProps} />,
})

export {
  screen, fireEvent, act,
}
