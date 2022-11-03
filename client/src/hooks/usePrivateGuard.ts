import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as routerTool from 'tools/router'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const usePrivateGuard = () => {
  const navigate = useNavigate()

  const user = useSelector(selectors.selectUser())

  useEffect(() => {
    if (!user.hasLogin) navigate(routerTool.signInRoute())
  }, [user.hasLogin, navigate])
}

export default usePrivateGuard
