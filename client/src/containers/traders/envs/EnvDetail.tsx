import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import useTraderState from '../../../states/useTraderState'
import useTickerState from '../../../states/useTickerState'
import * as routerEnum from '../../../enums/router'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../../elements/TickerLabel'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: '28rem',
  },
  tickers: {
    width: 290,
  },
}))

const EnvDetail = () => {
  const classes = useStyles()
  const params = useParams()
  const navigate = useNavigate()

  const { getTraderEnv, fetchTraderEnv } = useTraderState()
  const { getTickerIdentity } = useTickerState()

  const envId = params.envId ? parseInt(params.envId) : null
  const traderEnv = getTraderEnv(envId)

  useEffect(() => {
    if (!envId) navigate(routerEnum.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderEnv) return
    fetchTraderEnv(envId!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderEnv])

  if (!traderEnv) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <TraderEnvCard
          traderEnv={traderEnv}
          isActive={false}
        />
        <div className={classes.tickers}>
          {traderEnv.tickerIds && traderEnv.tickerIds.map((tickerId) => {
            const ticker = getTickerIdentity(tickerId)
            return (
              <TickerLabel
                key={tickerId}
                ticker={ticker}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EnvDetail
