import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Spinner } from 'flowbite-react'
import { Provider, useSelector } from 'react-redux'
import { store } from 'stores'
import Router from './containers/Router'
import { context } from './context'
import useStore from './states/store'
import * as commonEnum from './enums/common'
import * as storageAdapter from 'adapters/storage'
import * as requestAdapter from 'adapters/request'
import * as selectors from 'selectors'

import './index.css'
import 'react-datepicker/dist/react-datepicker.css'

const authToken = storageAdapter.get(commonEnum.StorageKey.AuthToken)
if (authToken) requestAdapter.setAuthToken(authToken)

const App = () => {
  const store = useStore()
  const { isLoading } = useSelector(selectors.selectGlobal())

  return (
    <>
      {isLoading && (
        <div className='fixed h-screen w-full flex items-center justify-center'>
          <Spinner size='xl' />
        </div>
      )}
      <context.Provider value={store}>
        <Router />
      </context.Provider>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
