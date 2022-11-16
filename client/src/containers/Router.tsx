import * as routerEnum from 'enums/router'
import { Route, Routes } from 'react-router-dom'
import Activation from './accounts/Activation'
import BehaviorDetail from './traders/behaviors/BehaviorDetail'
import BehaviorList from './traders/behaviors/BehaviorList'
import ComboBuilder from './traders/combos/ComboBuilder'
import ComboDetail from './traders/combos/ComboDetail'
import EnvBuilder from './traders/envs/EnvBuilder'
import EnvDetail from './traders/envs/EnvDetail'
import Forgot from './accounts/Forgot'
import Layout from './layouts/Layout'
import Pricing from './general/Pricing'
import Privacy from './general/Privacy'
import ProfileBuilder from './traders/profiles/profile-builder/ProfileBuilder'
import ProfileDashboard from './traders/profiles/ProfileDashboard'
import ProfileDetail from './traders/profiles/ProfileDetail'
import Reset from './accounts/Reset'
import Setting from './accounts/Setting'
import SignIn from './accounts/SignIn'
import SignUp from './accounts/SignUp'
import Terms from './general/Terms'
import TickerDetail from './traders/tickers/TickerDetail'
import TickerList from './traders/tickers/TickerList'
import TopCombos from './traders/combos/TopCombos'
import TopProfiles from './traders/profiles/TopProfiles'

const Router = () => {
  return (
    <Layout>
      <Routes>
        <Route
          path={routerEnum.Nav.Terms}
          element={<Terms />}
        />
        <Route
          path={routerEnum.Nav.Privacy}
          element={<Privacy />}
        />
        <Route
          path={routerEnum.Nav.Pricing}
          element={<Pricing />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/profiles/tops`}
          element={<TopProfiles />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/profiles/:traderId/:accessCode`}
          element={<ProfileDetail />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/profiles/build`}
          element={<ProfileBuilder />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/envs/build`}
          element={<EnvBuilder />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/envs/:envId`}
          element={<EnvDetail />}
        />
        <Route
          path={routerEnum.Nav.Behaviors}
          element={<BehaviorList />}
        />
        <Route
          path={`${routerEnum.Nav.Behaviors}/:behavior/envs/:envId`}
          element={<BehaviorDetail />}
        />
        <Route
          path={routerEnum.Nav.Tickers}
          element={<TickerList />}
        />
        <Route
          path={`${routerEnum.Nav.Tickers}/:tickerId/envs/:envId`}
          element={<TickerDetail />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/combos/:comboId`}
          element={<ComboDetail />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/combos/tops`}
          element={<TopCombos />}
        />
        <Route
          path={`${routerEnum.Nav.Traders}/combos/build`}
          element={<ComboBuilder />}
        />
        <Route
          path={routerEnum.Nav.Dashboard}
          element={<ProfileDashboard />}
        />
        <Route
          path={routerEnum.Nav.Setting}
          element={<Setting />}
        />
        <Route
          path={routerEnum.Nav.SignIn}
          element={<SignIn />}
        />
        <Route
          path={routerEnum.Nav.SignUp}
          element={<SignUp />}
        />
        <Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
        <Route
          path={routerEnum.Nav.Forgot}
          element={<Forgot />}
        />
        <Route
          path={`${routerEnum.Nav.Reset}/:code`}
          element={<Reset />}
        />
      </Routes>
    </Layout>
  )
}

export default Router
