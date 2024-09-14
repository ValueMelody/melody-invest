import * as commonEnum from 'enums/common'
import * as routerEnum from 'enums/router'
import { Route, Routes } from 'react-router-dom'
import Activation from './accounts/Activation'
import BehaviorDetail from './traders/behaviors/BehaviorDetail'
import BehaviorList from './traders/behaviors/BehaviorList'
import ComboBuilder from './traders/combos/ComboBuilder'
import ComboDetail from './traders/combos/ComboDetail'
import Disclaimer from './general/Disclaimer'
import EnvBuilder from './traders/envs/EnvBuilder'
import EnvDetail from './traders/envs/EnvDetail'
import Forgot from './accounts/Forgot'
import Home from './general/Home'
import Layout from './layouts/Layout'
import Limitations from './general/Limitations'
import Maintain from './general/Maintain'
import Privacy from './general/Privacy'
import ProfileBuilder from './traders/profiles/profile-builder/ProfileBuilder'
import ProfileDashboard from './traders/profiles/ProfileDashboard'
import ProfileDetail from './traders/profiles/ProfileDetail'
import Reset from './accounts/Reset'
import Setting from './accounts/Setting'
import SignIn from './accounts/SignIn'
import SignUp from './accounts/SignUp'
import Terms from './general/Terms'
import TickerList from './traders/tickers/TickerList'

const Router = () => {
  const isMaintaining = commonEnum.Env.IsMaintaining

  return (
    <Layout>
      {isMaintaining && <Maintain />}
      {!isMaintaining && (
        <Routes>
          <Route
            path={routerEnum.Nav.Terms}
            element={<Terms />}
          />
          <Route
            path={routerEnum.Nav.Root}
            element={<Home />}
          />
          <Route
            path={routerEnum.Nav.Privacy}
            element={<Privacy />}
          />
          <Route
            path={routerEnum.Nav.Disclaimer}
            element={<Disclaimer />}
          />
          <Route
            path={routerEnum.Nav.Limitations}
            element={<Limitations />}
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
            path={`${routerEnum.Nav.Traders}/combos/:comboId`}
            element={<ComboDetail />}
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
      )}
    </Layout>
  )
}

export default Router
