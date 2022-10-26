import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { Header } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import useResourceState from 'states/useResourceState'
import useTraderState from 'states/useTraderState'
import useTraderRequest from 'requests/useTraderRequest'
import { createUseStyles } from 'react-jss'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import EachTops from 'containers/traders/blocks/EachTops'

const useStyles = createUseStyles((
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
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { traderClasses } = useTraderStyle()
  const { commonClasses } = useCommonStyle()

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

  useEffect(() => {
    if (!tickerId || !envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
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
    <section className={traderClasses.root}>
      <section className={traderClasses.main}>
        <header className={classNames(
          commonClasses.rowStart,
          classes.header,
        )}>
          <TickerLabel ticker={tickerIdentity} color='grey' />
          <h4 className={classes.desc}>
            {tickerIdentity.name}
          </h4>
        </header>
        <Header
          as='h3'
          icon='star'
          content={localeTool.t('availableTickers.topProfiles', { name: traderEnv.record.name })}
          className={classes.leftTitle}
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
      <aside className={traderClasses.aside}>
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
