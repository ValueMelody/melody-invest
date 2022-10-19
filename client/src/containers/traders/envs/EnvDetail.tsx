import * as interfaces from '@shared/interfaces'
import useTraderState from 'states/useTraderState'
import useResourceState from 'states/useResourceState'
import useTraderRequest from 'requests/useTraderRequest'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import EachTops from 'containers/traders/blocks/EachTops'
import UnwatchEnvButton from 'containers/traders/blocks/UnwatchEnvButton'
import TickerLabel from 'containers/traders/elements/TickerLabel'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  tickers: {
    width: 290,
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottom: `1px solid ${theme.PrimaryColor}`,
  },
  watch: {
    width: 290,
  },
  rightTitle: {
    marginLeft: '0.5rem !important',
  },
}))

const EnvDetail = () => {
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { traderClasses } = useTraderStyle()
  const { commonClasses } = useCommonStyle()

  const { getTraderEnv } = useTraderState()
  const { fetchTraderEnv } = useTraderRequest()
  const { getTickerIdentity } = useResourceState()

  const envId = params.envId ? parseInt(params.envId) : null
  const traderEnv = getTraderEnv(envId)
  const topTraderProfiles = traderEnv?.tops
  const envRecord = traderEnv?.record

  const bestOverall = topTraderProfiles?.yearly[0] || null
  const bestPastYear = topTraderProfiles?.pastYear[0] || null
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0] || null
  const bestPastMonth = topTraderProfiles?.pastMonth[0] || null
  const bestPastWeek = topTraderProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (!envId || !envRecord || topTraderProfiles) return
    fetchTraderEnv(envId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envId, envRecord, topTraderProfiles])

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    if (!envId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv || !topTraderProfiles) return null

  return (
    <section className={traderClasses.root}>
      <aside className={traderClasses.aside}>
        <TraderEnvCard
          traderEnv={traderEnv.record}
        />
        <div className={classes.tickers}>
          {traderEnv.record.tickerIds && traderEnv.record.tickerIds.map((tickerId) => (
            <TickerLabel
              color='blue'
              key={tickerId}
              ticker={getTickerIdentity(tickerId)}
              onClick={handleClickTicker}
            />
          ))}
        </div>
        {!traderEnv.record.isSystem && (
          <div className={vendorTool.classNames(
            commonClasses.rowAround,
            classes.watch,
          )}>
            <UnwatchEnvButton traderEnv={traderEnv.record} />
          </div>
        )}
      </aside>
      <section className={traderClasses.main}>
        <vendorTool.ui.Header
          as='h3'
          icon='star'
          content={localeTool.t('traderEnv.topProfiles')}
          className={classes.rightTitle}
        />
        <section className={commonClasses.rowStart}>
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
