import useUserState from 'states/useUserState'
import * as routerTool from 'tools/router'
import * as vendorTool from 'tools/vendor'

const usePrivateGuard = () => {
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ state --

  const { getUser } = useUserState()
  const user = getUser()

  // ------------------------------------------------------------ effect --

  vendorTool.react.useEffect(() => {
    if (!user.hasLogin) navigate(routerTool.signInRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.hasLogin])
}

export default usePrivateGuard
