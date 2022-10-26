import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as routerTool from 'tools/router'
import useUserRequest from 'requests/useUserRequest'
import usePublicGuard from 'handlers/usePublicGuard'

const Activation = () => {
  usePublicGuard()
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const accessCode = params.code

  const { activateUser } = useUserRequest()

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!accessCode || accessCode.length !== 64) {
      navigate(routerTool.signInRoute())
      return
    }

    activateUser(accessCode)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ------------------------------------------------------------ UI --

  return (
    <div />
  )
}

export default Activation
