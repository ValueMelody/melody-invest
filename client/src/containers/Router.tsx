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
            path={routerConstant.NAV.SIGN_IN}
            element={<SignIn />}
          />
          <Route
            path={routerConstant.NAV.SIGN_UP}
            element={<SignUp />}
          />
          <Route
            path={routerConstant.NAV.DASHBOARD}
            element={<Dashboard />}
          />
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
