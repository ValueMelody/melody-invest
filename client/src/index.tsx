import Router from './containers/Router'
import { context } from './states/context'
import useStore from './states/store'
import * as themeEnum from './enums/theme'
import * as vendorTool from './tools/vendor'

import './index.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-datepicker/dist/react-datepicker.css'

const App = () => {
  const store = useStore()

  return (
    <>
      <vendorTool.ui.Loader active={store.common.isLoading} size='large' />
      <context.Provider value={store}>
        <vendorTool.jss.ThemeProvider theme={themeEnum.theme}>
          <Router />
        </vendorTool.jss.ThemeProvider>
      </context.Provider>
    </>
  )
}

vendorTool.dom.render(
  <vendorTool.router.BrowserRouter>
    <App />
  </vendorTool.router.BrowserRouter>,
  document.getElementById('root'),
)
