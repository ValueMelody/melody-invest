import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { Segment } from 'semantic-ui-react'
import useTrader from '../../states/useTraderProfile'
import * as routerConstant from '../../constants/router'
import * as localeTool from '../../tools/locale'
import TraderStats from './blocks/TraderStats'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  holdings: {
    width: '60%',
  },
}))

const Profile = () => {
  const params = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const {
    getTraderProfile, fetchTraderProfile, getProfileHoldings, fetchProfileHoldings,
  } = useTrader()

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const traderProfile = getTraderProfile(traderId)
  const profileHoldings = getProfileHoldings(traderId)
  const defaultHoldings = (profileHoldings || []).slice(0, 5)
  console.log(defaultHoldings)

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

  if (!traderProfile || !profileHoldings) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <TraderStats
        trader={traderProfile.trader}
        pattern={traderProfile.pattern}
      />
      <div className={classes.holdings}>
        <h4><b>{localeTool.t('profile.history')}</b></h4>
        {defaultHoldings.map((holding) => (
          <Segment key={holding.id} />
        ))}
      </div>
    </div>
  )
}

export default Profile
