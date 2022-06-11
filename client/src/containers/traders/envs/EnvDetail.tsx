import * as interfaces from '@shared/interfaces'
import useTraderState from '../../../states/useTraderState'
import useResourceState from '../../../states/useResourceState'
import useTraderRequest from '../../../requests/useTraderRequest'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../elements/TickerLabel'
import WatchButton from '../elements/WatchButton'
import EachTops from '../blocks/EachTops'
import usePageStyles from '../../hooks/usePageStyles'

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
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { getTraderEnv } = useTraderState()
  const { fetchTraderEnv, deleteTraderEnv } = useTraderRequest()
  const { getTickerIdentity } = useResourceState()

  const envId = params.envId ? parseInt(params.envId) : null
  const traderEnv = getTraderEnv(envId)
  const topTraderProfiles = traderEnv?.tops

  const bestOverall = topTraderProfiles?.yearly[0] || null
  const bestPastYear = topTraderProfiles?.pastYear[0] || null
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0] || null
  const bestPastMonth = topTraderProfiles?.pastMonth[0] || null
  const bestPastWeek = topTraderProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Handler --

  const handleUnwatch = async () => {
    if (!envId) return
    await deleteTraderEnv(envId)
  }

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (!envId || topTraderProfiles) return
    fetchTraderEnv(envId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envId, topTraderProfiles])

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    if (!envId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv || !topTraderProfiles) return null

  return (
    <section className={pageClasses.root}>
      <aside className={pageClasses.aside}>
        <TraderEnvCard
          traderEnv={traderEnv.record}
          isActive={false}
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
          <div className={vendorTool.classNames('row-around', classes.watch)}>
            <WatchButton
              isWatched={true}
              onToggle={handleUnwatch}
            />
          </div>
        )}
      </aside>
      <section className={pageClasses.main}>
        <vendorTool.ui.Header
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
