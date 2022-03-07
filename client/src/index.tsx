import React from 'react'
import ReactDOM from 'react-dom'
import Router from './containers/Router'
import * as localTool from './tools/locale'

import './index.css'
import 'semantic-ui-css/semantic.min.css'

localTool.init()

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root'),
)
