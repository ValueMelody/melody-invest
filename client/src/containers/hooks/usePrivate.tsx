import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useUser from '../../states/useUser'
import * as routerEnum from '../../enums/router'

const usePrivate = () => {
  const navigate = useNavigate()
  const { userType } = useUser()

  useEffect(() => {
    if (!userType) navigate(routerEnum.NAV.SIGN_IN)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])
}

export default usePrivate
