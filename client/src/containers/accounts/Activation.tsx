import * as actions from 'actions'
import * as routerTool from 'tools/router'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import usePublicGuard from 'hooks/usePublicGuard'

const Activation = () => {
  usePublicGuard()

  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const navigate = useNavigate()

  const accessCode = params.code

  useEffect(() => {
    if (!accessCode || accessCode.length !== 64) {
      navigate(routerTool.signInRoute())
      return
    }

    dispatch(actions.activateUser(accessCode))
      .then(() => navigate(routerTool.signInRoute()))
  }, [dispatch, navigate, accessCode])

  return (
    <div />
  )
}

export default Activation
