import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const usePrivateGuard = () => {
  const navigate = useNavigate()

  const global = useSelector(selectors.selectGlobal())

  useEffect(() => {
    if (!global.refreshToken) navigate(routerTool.signInRoute())
  }, [global.refreshToken, navigate])
}

export default usePrivateGuard
