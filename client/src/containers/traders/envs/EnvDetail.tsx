import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import useTraderState from '../../../states/useTraderState'
import useTickerState from '../../../states/useTickerState'
import * as routerEnum from '../../../enums/router'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../elements/TickerLabel'
import WatchButton from '../elements/WatchButton'
import ProfileCard from '../blocks/ProfileCard'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  container: {
    alignItems: 'flex-start',
  },
  left: {
    width: '24rem',
  },
  tickers: {
    width: 290,
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottom: `1px solid ${theme.PRIMARY_COLOR}`,
  },
  watch: {
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

  // ------------------------------------------------------------ State --

  const {
    getTraderEnv, getTopProfiles, getTraderProfile,
    fetchTraderEnv, fetchTopProfiles,
    deleteWatchedEnv,
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

  // ------------------------------------------------------------ Handler --

  const handleUnwatch = async () => {
    if (!envId) return
    const result = await deleteWatchedEnv(envId)
    if (result) {
      const link = `${routerEnum.NAV.DASHBOARD}`
      navigate(link)
    }
  }

  // ------------------------------------------------------------ Effect --

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

  // ------------------------------------------------------------ Interface --

  if (!traderEnv || !topProfiles) return null

  return (
    <section className={classNames('row-between', classes.container)}>
      <aside className={classes.left}>
        <TraderEnvCard
          traderEnv={traderEnv}
          isActive={false}
        />
        <div className={classes.tickers}>
          {traderEnv.tickerIds && traderEnv.tickerIds.map((tickerId) => (
            <TickerLabel
              key={tickerId}
              ticker={getTickerIdentity(tickerId)}
            />
          ))}
        </div>
        <div className={classNames('row-around', classes.watch)}>
          <WatchButton
            isWatched={true}
            onToggle={handleUnwatch}
          />
        </div>
      </aside>
      <section className={classNames('row-start', classes.right)}>
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
      </section>
    </section>
  )
}

export default EnvDetail