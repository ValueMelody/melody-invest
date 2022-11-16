import './index.css'
import 'react-datepicker/dist/react-datepicker.css'
import * as commonEnum from './enums/common'
import * as requestAdapter from 'adapters/request'
import * as selectors from 'selectors'
import * as storageAdapter from 'adapters/storage'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'
import Router from './containers/Router'
import { Spinner } from 'flowbite-react'
import { store } from 'stores'

const authToken = storageAdapter.get(commonEnum.StorageKey.AuthToken)
if (authToken) requestAdapter.setAuthToken(authToken)

const App = () => {
  const { isLoading } = useSelector(selectors.selectGlobal())

  return (
    <>
      {isLoading && (
        <div className='fixed h-screen w-full flex items-center justify-center'>
          <Spinner size='xl' />
        </div>
      )}
      <Router />
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
