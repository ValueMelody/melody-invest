import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import Router from './containers/Router'
import * as localTool from './tools/locale'
import * as themeConstants from './constants/theme'

import './index.css'
import 'semantic-ui-css/semantic.min.css'

localTool.init()

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={themeConstants.BASIC}>
      <Router />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
