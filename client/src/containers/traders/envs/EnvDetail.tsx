import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Header } from 'semantic-ui-react'
import useTraderState from '../../../states/useTraderState'
import useTickerState from '../../../states/useTickerState'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../elements/TickerLabel'
import WatchButton from '../elements/WatchButton'
import EachTops from '../blocks/EachTops'

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
  rightTitle: {
    marginLeft: '0.5rem !important',
  },
}))

const EnvDetail = () => {
  const classes = useStyles()
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const {
    getTraderEnv, getTopProfiles, fetchTraderEnv, fetchTopProfiles, deleteWatchedEnv,
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

  // ------------------------------------------------------------ Handler --

  const handleUnwatch = async () => {
    if (!envId) return
    const result = await deleteWatchedEnv(envId)
    if (result) {
      const link = routerTool.dashboardRoute()
      navigate(link)
    }
  }

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
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

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    if (!envId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

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
              color='blue'
              key={tickerId}
              ticker={getTickerIdentity(tickerId)}
              onClick={handleClickTicker}
            />
          ))}
        </div>
        {!traderEnv.isSystem && (
          <div className={classNames('row-around', classes.watch)}>
            <WatchButton
              isWatched={true}
              onToggle={handleUnwatch}
            />
          </div>
        )}
      </aside>
      <section className={classNames('column-start', classes.right)}>
        <Header
          as='h3'
          icon='star'
          content={localeTool.t('traderEnv.topProfiles')}
          className={classes.rightTitle}
        />
        <section className={'row-start'}>
          <EachTops
            bestOverall={bestOverall}
            bestPastYear={bestPastYear}
            bestPastQuarter={bestPastQuarter}
            bestPastMonth={bestPastMonth}
            bestPastWeek={bestPastWeek}
          />
        </section>
      </section>
    </section>
  )
}

export default EnvDetail
