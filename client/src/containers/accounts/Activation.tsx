import usePublicGuard from '../hooks/usePublicGuard'
import * as vendorTool from '../../tools/vendor'
import * as routerTool from '../../tools/router'
import useUserState from '../../states/useUserState'

const Activation = () => {
  usePublicGuard()
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const accessCode = params.code

  const { activateUser } = useUserState()

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!accessCode || accessCode.length !== 64) {
      navigate(routerTool.signInRoute())
      return
    }

    activateUser(accessCode)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ------------------------------------------------------------ UI --

  return (
    <div />
  )
}

export default Activation
