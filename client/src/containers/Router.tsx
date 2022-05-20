import * as vendorTool from '../tools/vendor'
import Activation from './accounts/Activation'
import SignUp from './accounts/SignUp'
import SignIn from './accounts/SignIn'
import Setting from './accounts/Setting'
import Forgot from './accounts/Forgot'
import Layout from './layouts/Layout'
import TopProfiles from './traders/profiles/TopProfiles'
import ProfileDetail from './traders/profiles/ProfileDetail'
import ProfileDashboard from './traders/profiles/ProfileDashboard'
import ProfileBuilder from './traders/profiles/profile-builder/ProfileBuilder'
import BehaviorList from './traders/behaviors/BehaviorList'
import BehaviorDetail from './traders/behaviors/BehaviorDetail'
import EnvBuilder from './traders/envs/EnvBuilder'
import EnvDetail from './traders/envs/EnvDetail'
import TickerList from './traders/tickers/TickerList'
import TickerDetail from './traders/tickers/TickerDetail'
import TopCombos from './traders/combos/TopCombos'
import ComboDetail from './traders/combos/ComboDetail'
import ComboBuilder from './traders/combos/ComboBuilder'
import * as routerEnum from '../enums/router'

const Router = () => {
  return (
    <Layout>
      <vendorTool.router.Routes>
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/profiles/tops`}
          element={<TopProfiles />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/profiles/:traderId/:accessCode`}
          element={<ProfileDetail />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/profiles/build`}
          element={<ProfileBuilder />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/envs/build`}
          element={<EnvBuilder />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/envs/:envId`}
          element={<EnvDetail />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.Behaviors}
          element={<BehaviorList />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Behaviors}/:behavior/envs/:envId`}
          element={<BehaviorDetail />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.Tickers}
          element={<TickerList />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Tickers}/:tickerId/envs/:envId`}
          element={<TickerDetail />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/combos/:comboId`}
          element={<ComboDetail />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/combos/tops`}
          element={<TopCombos />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Traders}/combos/build`}
          element={<ComboBuilder />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.Dashboard}
          element={<ProfileDashboard />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.Setting}
          element={<Setting />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.SignIn}
          element={<SignIn />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.SignUp}
          element={<SignUp />}
        />
        <vendorTool.router.Route
          path={`${routerEnum.Nav.Activation}/:code`}
          element={<Activation />}
        />
        <vendorTool.router.Route
          path={routerEnum.Nav.Forgot}
          element={<Forgot />}
        />
      </vendorTool.router.Routes>
    </Layout>
  )
}

export default Router
