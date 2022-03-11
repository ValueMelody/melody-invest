import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TopTraders from './traders/TopTraders'
import Pattern from './traders/Trader'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path={routerConstant.NAV.TOP_TRADERS}
            element={<TopTraders />}
          />
          <Route
            path={`${routerConstant.NAV.TRADERS}/:traderId/:accessCode`}
            element={<Pattern />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
