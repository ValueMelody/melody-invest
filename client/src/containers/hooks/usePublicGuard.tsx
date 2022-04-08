import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserState from '../../states/useUserState'
import * as routerTool from '../../tools/router'

const usePublicGuard = () => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ state --

  const { getUser } = useUserState()
  const user = getUser()

  // ------------------------------------------------------------ effect --

  useEffect(() => {
    if (user.userType) navigate(routerTool.settingRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userType])
}

export default usePublicGuard
