import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import { context } from './states/context'
import Router from './containers/Router'
import * as localTool from './tools/locale'
import * as themeConstants from './constants/theme'

import './index.css'
import 'semantic-ui-css/semantic.min.css'

localTool.init()

const App = () => {
  const [patterns, setPatterns] = useState({ })

  const states = {
    patterns,
    setPatterns,
  }

  return (
    <React.StrictMode>
      <context.Provider value={states}>
        <ThemeProvider theme={themeConstants.BASIC}>
          <Router />
        </ThemeProvider>
      </context.Provider>
    </React.StrictMode>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
