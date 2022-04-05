import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserState from '../../states/useUserState'
import * as routerTool from '../../tools/router'

const usePrivateGuard = () => {
  const navigate = useNavigate()
  const { getUser } = useUserState()

  const user = getUser()

  useEffect(() => {
    if (!user.userType) navigate(routerTool.signInRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userType])
}

export default usePrivateGuard
