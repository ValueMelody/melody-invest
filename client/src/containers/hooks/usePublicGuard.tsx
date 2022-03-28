import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserState from '../../states/useUserState'
import * as routerEnum from '../../enums/router'

const usePublicGuard = () => {
  const navigate = useNavigate()
  const { userType } = useUserState()

  useEffect(() => {
    if (userType) navigate(routerEnum.NAV.SETTING)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])
}

export default usePublicGuard
