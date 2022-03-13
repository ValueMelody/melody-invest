import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-jss'
import { Loader } from 'semantic-ui-react'
import Router from './containers/Router'
import { context } from './states/context'
import useStore from './states/useStore'
import * as localTool from './tools/locale'
import * as themeConstants from './constants/theme'

import './index.css'
import 'semantic-ui-css/semantic.min.css'

localTool.init()

const App = () => {
  const store = useStore()

  return (
    <>
      <Loader active={store.common.isLoading} size='large' />
      <context.Provider value={store}>
        <ThemeProvider theme={themeConstants.theme}>
          <Router />
        </ThemeProvider>
      </context.Provider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
