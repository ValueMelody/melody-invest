import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TopPatterns from './patterns/TopPatterns'
import Pattern from './patterns/Pattern'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path={routerConstant.NAV.TOP_PATTERNS}
            element={<TopPatterns />}
          />
          <Route
            path={`${routerConstant.NAV.PATTERNS}/:traderId/:accessCode`}
            element={<Pattern />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
