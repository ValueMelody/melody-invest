import './index.css'
import 'react-datepicker/dist/react-datepicker.css'

import Client from './containers/Client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import ReactDOM from 'react-dom/client'
import { store } from 'stores'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <HashRouter>
    <Provider store={store}>
      <Client />
    </Provider>
  </HashRouter>,
)
