import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserState from '../../states/useUserState'
import * as routerEnum from '../../enums/router'

const usePublicGuard = () => {
  const navigate = useNavigate()
  const { getUser } = useUserState()

  const user = getUser()

  useEffect(() => {
    if (user.userType) navigate(routerEnum.NAV.SETTING)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userType])
}

export default usePublicGuard
