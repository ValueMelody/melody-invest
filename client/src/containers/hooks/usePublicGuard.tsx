import useUserState from '../../states/useUserState'
import * as vendorTool from '../../tools/vendor'
import * as routerTool from '../../tools/router'

const usePublicGuard = () => {
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ state --

  const { getUser } = useUserState()
  const user = getUser()

  // ------------------------------------------------------------ effect --

  vendorTool.react.useEffect(() => {
    if (user.userType) navigate(routerTool.dashboardRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userType])
}

export default usePublicGuard
