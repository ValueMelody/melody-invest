import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserState from 'states/useUserState'
import * as routerTool from 'tools/router'

const usePrivateGuard = () => {
  const navigate = useNavigate()

  // ------------------------------------------------------------ state --

  const { getUser } = useUserState()
  const user = getUser()

  // ------------------------------------------------------------ effect --

  useEffect(() => {
    if (!user.hasLogin) navigate(routerTool.signInRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.hasLogin])
}

export default usePrivateGuard
