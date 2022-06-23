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

const WithThemeProvider: vendorTool.react.FC = ({ children }) => {
  return (
      <vendorTool.jss.ThemeProvider theme={themeEnum.theme}>
        {children}
      </vendorTool.jss.ThemeProvider>
  )
}

const WithStoreProvider = ({
  children,
  store,
}: {
  children?: vendorTool.react.ReactNode;
  store?: object;
}) => {
  const defaultStore = useStore()
  return (
    <context.Provider value={{ ...defaultStore, ...store }}>
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
