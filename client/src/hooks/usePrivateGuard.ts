import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const usePrivateGuard = () => {
  const navigate = useNavigate()

  const user = useSelector(selectors.selectUser())

  useEffect(() => {
    if (!user.hasLogin) navigate(routerTool.signInRoute())
  }, [user.hasLogin, navigate])
}

export default usePrivateGuard
