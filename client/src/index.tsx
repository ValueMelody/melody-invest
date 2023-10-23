import './index.css'
import 'react-datepicker/dist/react-datepicker.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import ReactDOM from 'react-dom/client'
import { store } from 'stores'
import Client from './containers/Client'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Client />
    </Provider>
  </BrowserRouter>,
)
