import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import { Loader } from 'semantic-ui-react'
import Router from './containers/Router'
import * as context from './states/context'
import * as localTool from './tools/locale'
import * as themeConstants from './constants/theme'

import './index.css'
import 'semantic-ui-css/semantic.min.css'

localTool.init()

const App = () => {
  const [common, setCommon] = useState<context.Common>({
    isLoading: false,
  })

  const startLoading = () => {
    setCommon((state) => ({ ...state, isLoading: true }))
  }

  const stopLoading = () => {
    setCommon((state) => ({ ...state, isLoading: false }))
  }

  const [resources, setResources] = useState<context.Resources>({
    topProfiles: null,
  })

  const [traderProfiles, setTraderProfiles] = useState<context.TraderProfiles>({})

  const states = {
    common,
    startLoading,
    stopLoading,
    resources,
    setResources,
    traderProfiles,
    setTraderProfiles,
  }

  return (
    <React.StrictMode>
      <Loader active={common.isLoading} size='large' />
      <context.store.Provider value={states}>
        <ThemeProvider theme={themeConstants.BASIC}>
          <Router />
        </ThemeProvider>
      </context.store.Provider>
    </React.StrictMode>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
