import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import TopProfiles from './profiles/TopProfiles'
import Profile from './profiles/Profile'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path={routerConstant.NAV.TOP_PROFILES}
            element={<TopProfiles />}
          />
          <Route
            path={`${routerConstant.NAV.PROFILES}/:traderId/:accessCode`}
            element={<Profile />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
