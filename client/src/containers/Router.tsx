import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TopPatterns from './top-patterns/TopPatterns'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/">
            <Route path={routerConstant.NAV.TOP_PATTERNS} element={<TopPatterns />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
