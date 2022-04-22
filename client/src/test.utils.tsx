import {
  render as defaultRender,
  screen,
  fireEvent,
  RenderOptions,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { context } from './states/context'
import useStore from './states/store'
import * as vendorTool from './tools/vendor'
import * as themeEnum from './enums/theme'

const WithProviders: vendorTool.react.FC = ({ children }) => {
  const store = useStore()

  return (
    <context.Provider value={store}>
      <vendorTool.jss.ThemeProvider theme={themeEnum.theme}>
        {children}
      </vendorTool.jss.ThemeProvider>
    </context.Provider>
  )
}

const Base: vendorTool.react.FC = ({ children }) => {
  return (
    <vendorTool.router.BrowserRouter>
      <WithProviders>
        {children}
      </WithProviders>
    </vendorTool.router.BrowserRouter>
  )
}

export const render = (
  ui: vendorTool.react.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => defaultRender(ui, { wrapper: Base, ...options })

export {
  screen, fireEvent,
}
