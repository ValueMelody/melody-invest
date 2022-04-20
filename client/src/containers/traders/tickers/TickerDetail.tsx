import useTickerState from '../../../states/useTickerState'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import TickerLabel from '../elements/TickerLabel'
import TraderEnvCard from '../elements/TraderEnvCard'
import * as vendorTool from '../../../tools/vendor'
import * as routerTool from '../../../tools/router'
import * as localeTool from '../../../tools/locale'
import * as themeEnum from '../../../enums/theme'
import EachTops from '../blocks/EachTops'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    paddingBottom: '1.5rem',
  },
  leftTitle: {
    margin: '2rem 0 1rem 0.5rem !important',
  },
}))

const TickerDetail = () => {
  const params = vendorTool.router.useParams()
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()
  const { getTickerDetail, fetchTickerDetail } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : null
  const envId = params.envId ? parseInt(params.envId) : 1

  const tickerIdentities = getTickerIdentities()
  const tickerIdentity = tickerIdentities.find((identity) => identity.id === tickerId) || null

  const tickerDetail = getTickerDetail(envId, tickerId)
  const topProfiles = tickerDetail?.tops
  const traderEnv = user.userTraderEnvs.find((env) => env.id === envId) || null

  const bestOverall = topProfiles?.yearly[0] || null
  const bestPastYear = topProfiles?.pastYear[0] || null
  const bestPastQuarter = topProfiles?.pastQuarter[0] || null
  const bestPastMonth = topProfiles?.pastMonth[0] || null
  const bestPastWeek = topProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!tickerId || !envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (tickerDetail || !tickerId || !envId) return
    fetchTickerDetail(envId, tickerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = (envId: number) => {
    if (!tickerId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  if (!tickerIdentity || !traderEnv) return null

  return (
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <header className={vendorTool.classNames('row-start', classes.header)}>
          <TickerLabel ticker={tickerIdentity} color='grey' />
          <h4 className={classes.desc}>
            {tickerIdentity.name}
          </h4>
        </header>
        <vendorTool.ui.Header
          as='h3'
          icon='star'
          content={localeTool.t('availableTickers.topProfiles', { name: traderEnv.name })}
          className={classes.leftTitle}
        />
        <section className='row-start'>
          <EachTops
            bestOverall={bestOverall}
            bestPastYear={bestPastYear}
            bestPastQuarter={bestPastQuarter}
            bestPastMonth={bestPastMonth}
            bestPastWeek={bestPastWeek}
          />
        </section>
      </section>
      <aside className={pageClasses.aside}>
        {user.userTraderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
            traderEnv={traderEnv}
            isActive={envId === traderEnv.id}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default TickerDetail
