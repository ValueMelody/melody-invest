import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './auths/SignUp'
import SignIn from './auths/SignIn'
import Layout from './layout/Layout'
import TopProfiles from './profiles/TopProfiles'
import Profile from './profiles/Profile'
import Dashboard from './dashboard/Dashboard'
import * as routerConstant from '../constants/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        <Route
            path={routerConstant.NAVS.SIGN_IN}
            element={<SignIn />}
          />
          <Route
            path={routerConstant.NAVS.SIGN_UP}
            element={<SignUp />}
          />
          <Route
            path={routerConstant.NAVS.DASHBOARD}
            element={<Dashboard />}
          />
          <Route
            path={routerConstant.NAVS.TOP_PROFILES}
            element={<TopProfiles />}
          />
          <Route
            path={`${routerConstant.NAVS.PROFILES}/:traderId/:accessCode`}
            element={<Profile />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
