import * as vendorTool from 'tools/vendor'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import usePublicGuard from 'handlers/usePublicGuard'

const Activation = () => {
  usePublicGuard()
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const accessCode = params.code

  const { activateUser } = useUserRequest()

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
