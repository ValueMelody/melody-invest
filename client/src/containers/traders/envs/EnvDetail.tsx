import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import useTraderState from '../../../states/useTraderState'
import useTickerState from '../../../states/useTickerState'
import * as routerEnum from '../../../enums/router'
import * as localeTool from '../../../tools/locale'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../elements/TickerLabel'
import ProfileCard from '../blocks/ProfileCard'

const useStyles = createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: '24rem',
  },
  tickers: {
    width: 290,
  },
  right: {
    width: 'calc(100% - 24rem)',
    minWidth: '38rem',
    alignItems: 'flex-start',
  },
  noResult: {
    marginTop: '1rem !important',
  },
  card: {
    width: '28rem',
    margin: '1rem',
  },
  subTitle: {
    marginBottom: '1rem !important',
  },
}))

const EnvDetail = () => {
  const classes = useStyles()
  const params = useParams()
  const navigate = useNavigate()

  const {
    getTraderEnv, getTopProfiles, getTraderProfile,
    fetchTraderEnv, fetchTopProfiles,
  } = useTraderState()
  const { getTickerIdentity } = useTickerState()

  const envId = params.envId ? parseInt(params.envId) : null
  const traderEnv = getTraderEnv(envId)
  const topProfiles = getTopProfiles(envId)

  const bestOverall = topProfiles?.yearly[0] || null
  const bestPastYear = topProfiles?.pastYear[0] || null
  const bestPastQuarter = topProfiles?.pastQuarter[0] || null
  const bestPastMonth = topProfiles?.pastMonth[0] || null
  const bestPastWeek = topProfiles?.pastWeek[0] || null

  const hasResult = bestOverall || bestPastYear || bestPastQuarter || bestPastMonth || bestPastWeek

  useEffect(() => {
    if (!envId) navigate(routerEnum.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (traderEnv) return
    fetchTraderEnv(envId!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderEnv])

  useEffect(() => {
    if (!envId || topProfiles) return
    fetchTopProfiles(envId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envId, topProfiles])

  if (!traderEnv || !topProfiles) return null

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
      <div className={classNames('row-start', classes.right)}>
        {!hasResult && <h4 className={classes.noResult}>{localeTool.t('traderEnv.noResultYet')}</h4>}
        {hasResult && (
          <>
            <div className={classes.card}>
              <h4 className={classes.subTitle}>
                {localeTool.t('bestReturn.yearlyTitle')}
              </h4>
              <ProfileCard
                profile={getTraderProfile(bestOverall)}
              />
            </div>
            <div className={classes.card}>
              <h4 className={classes.subTitle}>
                {localeTool.t('bestReturn.pastYearTitle')}:
              </h4>
              <ProfileCard
                profile={getTraderProfile(bestPastYear)}
              />
            </div>
            <div className={classes.card}>
              <h4 className={classes.subTitle}>
                {localeTool.t('bestReturn.pastQuarterTitle')}:
              </h4>
              <ProfileCard
                profile={getTraderProfile(bestPastQuarter)}
              />
            </div>
            <div className={classes.card}>
              <h4 className={classes.subTitle}>
                {localeTool.t('bestReturn.pastMonthTitle')}:
              </h4>
              <ProfileCard
                profile={getTraderProfile(bestPastMonth)}
              />
            </div>
            <div className={classes.card}>
              <h4 className={classes.subTitle}>
                {localeTool.t('bestReturn.pastWeekTitle')}:
              </h4>
              <ProfileCard
                profile={getTraderProfile(bestPastWeek)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EnvDetail
