import * as vendorTool from '../tools/vendor'
import SignUp from './accounts/SignUp'
import SignIn from './accounts/SignIn'
import Setting from './accounts/Setting'
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
import * as routerEnum from '../enums/router'

const Router = () => {
  return (
    <vendorTool.router.BrowserRouter>
      <Layout>
        <vendorTool.router.Routes>
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/profiles/tops`}
            element={<TopProfiles />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/profiles/:traderId/:accessCode`}
            element={<ProfileDetail />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/profiles/build`}
            element={<ProfileBuilder />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/envs/build`}
            element={<EnvBuilder />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/envs/:envId`}
            element={<EnvDetail />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.BEHAVIORS}
            element={<BehaviorList />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.BEHAVIORS}/:behavior/envs/:envId`}
            element={<BehaviorDetail />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.TICKERS}
            element={<TickerList />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TICKERS}/:tickerId/envs/:envId`}
            element={<TickerDetail />}
          />
          <vendorTool.router.Route
            path={`${routerEnum.NAV.TRADERS}/combos/tops`}
            element={<TopCombos />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.DASHBOARD}
            element={<ProfileDashboard />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.SETTING}
            element={<Setting />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.SIGN_IN}
            element={<SignIn />}
          />
          <vendorTool.router.Route
            path={routerEnum.NAV.SIGN_UP}
            element={<SignUp />}
          />
        </vendorTool.router.Routes>
      </Layout>
    </vendorTool.router.BrowserRouter>
  )
}

export default Router
