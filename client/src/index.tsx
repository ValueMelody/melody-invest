import './index.css'
import 'react-datepicker/dist/react-datepicker.css'
import * as selectors from 'selectors'
import { Provider, useSelector } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'
import Router from './containers/Router'
import { Spinner } from 'flowbite-react'
import { store } from 'stores'

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
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
)
