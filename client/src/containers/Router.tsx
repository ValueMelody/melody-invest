import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './auths/SignUp'
import SignIn from './auths/SignIn'
import Layout from './layout/Layout'
import TopProfiles from './profiles/TopProfiles'
import ProfileDetail from './profiles/ProfileDetail'
import ProfileDashboard from './profiles/ProfileDashboard'
import ProfileBuilder from './profiles/ProfileBuilder'
import * as routerEnum from '../enums/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path={routerEnum.NAV.TOP_PROFILES}
            element={<TopProfiles />}
          />
          <Route
            path={`${routerEnum.NAV.PROFILES}/:traderId/:accessCode`}
            element={<ProfileDetail />}
          />
          <Route
            path={`${routerEnum.NAV.PROFILES}/build`}
            element={<ProfileBuilder />}
          />
          <Route
            path={routerEnum.NAV.DASHBOARD}
            element={<ProfileDashboard />}
          />
          <Route
            path={routerEnum.NAV.SIGN_IN}
            element={<SignIn />}
          />
          <Route
            path={routerEnum.NAV.SIGN_UP}
            element={<SignUp />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default Router
