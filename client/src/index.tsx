import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'react-jss'
import { Loader } from 'semantic-ui-react'
import Router from './containers/Router'
import { context } from './context'
import useStore from './states/store'
import * as themeEnum from './enums/theme'
import * as commonEnum from './enums/common'
import * as storageAdapter from 'adapters/storage'
import * as requestAdapter from 'adapters/request'

import './index.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-datepicker/dist/react-datepicker.css'

const authToken = storageAdapter.get(commonEnum.StorageKey.AuthToken)
if (authToken) requestAdapter.setAuthToken(authToken)

const App = () => {
  const store = useStore()

  return (
    <>
      <Loader active={store.common.isLoading} size='large' />
      <context.Provider value={store}>
        <ThemeProvider theme={themeEnum.theme}>
          <Router />
        </ThemeProvider>
      </context.Provider>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
