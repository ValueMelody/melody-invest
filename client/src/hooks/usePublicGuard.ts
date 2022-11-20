import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const usePublicGuard = () => {
  const navigate = useNavigate()

  const global = useSelector(selectors.selectGlobal())

  useEffect(() => {
    if (global.hasLogin) navigate(routerTool.dashboardRoute())
  }, [global.hasLogin, navigate])
}

export default usePublicGuard
