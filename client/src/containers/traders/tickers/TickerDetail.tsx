import * as interfaces from '@shared/interfaces'
import useResourceState from '../../../states/useResourceState'
import useTraderState from '../../../states/useTraderState'
import useTraderRequest from '../../../requests/useTraderRequest'
import TickerLabel from '../elements/TickerLabel'
import TraderEnvCard from '../blocks/TraderEnvCard'
import * as vendorTool from '../../../tools/vendor'
import * as routerTool from '../../../tools/router'
import * as localeTool from '../../../tools/locale'
import EachTops from '../blocks/EachTops'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PrimaryColor}`,
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

  const { fetchTraderTicker } = useTraderRequest()
  const { getTickerIdentities } = useResourceState()
  const { getTraderTicker, getTraderEnv, getTraderEnvs } = useTraderState()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : null
  const envId = params.envId ? parseInt(params.envId) : 1

  const traderEnvs = getTraderEnvs()
  const tickerIdentities = getTickerIdentities()
  const tickerIdentity = tickerIdentities.find((identity) => identity.id === tickerId) || null

  const tickerDetail = getTraderTicker(envId, tickerId)
  const topTraderProfiles = tickerDetail?.tops
  const traderEnv = getTraderEnv(envId)

  const bestOverall = topTraderProfiles?.yearly[0] || null
  const bestPastYear = topTraderProfiles?.pastYear[0] || null
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0] || null
  const bestPastMonth = topTraderProfiles?.pastMonth[0] || null
  const bestPastWeek = topTraderProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!tickerId || !envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (tickerDetail || !tickerId || !envId) return
    fetchTraderTicker(envId, tickerId)
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
          content={localeTool.t('availableTickers.topProfiles', { name: traderEnv.record.name })}
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
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.record.id}
            traderEnv={traderEnv.record}
            isActive={envId === traderEnv.record.id}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default TickerDetail
