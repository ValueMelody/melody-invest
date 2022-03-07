import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TopTraders from './top-traders/TopTraders'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/">
            <Route path={routerConstant.NAV.TOP_TRADERS} element={<TopTraders />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
