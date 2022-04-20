import useTraderState from '../../../states/useTraderState'
import useTickerState from '../../../states/useTickerState'
import useUserState from '../../../states/useUserState'
import * as themeEnum from '../../../enums/theme'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import TraderEnvCard from '../elements/TraderEnvCard'
import TickerLabel from '../elements/TickerLabel'
import WatchButton from '../elements/WatchButton'
import EachTops from '../blocks/EachTops'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  tickers: {
    width: 290,
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottom: `1px solid ${theme.PRIMARY_COLOR}`,
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

  const {
    getTopProfiles, fetchTraderEnv, fetchTopProfiles, deleteWatchedEnv,
  } = useTraderState()
  const { getTickerIdentity } = useTickerState()
  const { getUser } = useUserState()

  const user = getUser()
  const envId = params.envId ? parseInt(params.envId) : null
  const traderEnv = user.userTraderEnvs.find((env) => env.id === envId) || null
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

  vendorTool.react.useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (!envId || traderEnv) return
    fetchTraderEnv(envId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderEnv])

  vendorTool.react.useEffect(() => {
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

  // ------------------------------------------------------------ UI --

  if (!traderEnv || !topProfiles) return null

  return (
    <section className={pageClasses.root}>
      <aside className={pageClasses.aside}>
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
