import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTrader from '../../states/useTraderProfile'
import * as routerConstant from '../../constants/router'
import TraderStats from './blocks/TraderStats'

const Profile = () => {
  const params = useParams()
  const navigate = useNavigate()
  const {
    getTraderProfile, fetchTraderProfile, getProfileHoldings, fetchProfileHoldings,
  } = useTrader()

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const traderProfile = getTraderProfile(traderId)
  const profileHoldings = getProfileHoldings(traderId)

  useEffect(() => {
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerConstant.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderProfile) return
    fetchTraderProfile(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  useEffect(() => {
    if (profileHoldings) return
    fetchProfileHoldings(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileHoldings])

  if (!traderProfile) return null

  return (
    <div>
      <TraderStats
        trader={traderProfile.trader}
        pattern={traderProfile.pattern}
      />
    </div>
  )
}

export default Profile
