import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './accounts/SignUp'
import SignIn from './accounts/SignIn'
import Setting from './accounts/Setting'
import Layout from './layouts/Layout'
import TopProfiles from './traders/profiles/top-profiles/TopProfiles'
import ProfileDetail from './traders/profiles/ProfileDetail'
import ProfileDashboard from './traders/profiles/ProfileDashboard'
import ProfileBuilder from './traders/profiles/profile-builder/ProfileBuilder'
import BehaviorList from './traders/behaviors/BehaviorList'
import BehaviorDetail from './traders/behaviors/BehaviorDetail'
import EnvBuilder from './traders/envs/EnvBuilder'
import EnvDetail from './traders/envs/EnvDetail'
import TickerList from './traders/tickers/TickerList'
import * as routerEnum from '../enums/router'

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path={`${routerEnum.NAV.TRADERS}/profiles/tops`}
            element={<TopProfiles />}
          />
          <Route
            path={`${routerEnum.NAV.TRADERS}/profiles/:traderId/:accessCode`}
            element={<ProfileDetail />}
          />
          <Route
            path={`${routerEnum.NAV.TRADERS}/profiles/build`}
            element={<ProfileBuilder />}
          />
          <Route
            path={`${routerEnum.NAV.TRADERS}/envs/build`}
            element={<EnvBuilder />}
          />
          <Route
            path={`${routerEnum.NAV.TRADERS}/envs/:envId`}
            element={<EnvDetail />}
          />
          <Route
            path={routerEnum.NAV.BEHAVIORS}
            element={<BehaviorList />}
          />
          <Route
            path={`${routerEnum.NAV.BEHAVIORS}/:behavior/envs/:envId`}
            element={<BehaviorDetail />}
          />
          <Route
            path={routerEnum.NAV.TICKERS}
            element={<TickerList />}
          />
          <Route
            path={routerEnum.NAV.DASHBOARD}
            element={<ProfileDashboard />}
          />
          <Route
            path={routerEnum.NAV.SETTING}
            element={<Setting />}
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
