import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Header } from 'semantic-ui-react'
import useTickerState from '../../../states/useTickerState'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import TickerLabel from '../elements/TickerLabel'
import TraderEnvCard from '../elements/TraderEnvCard'
import * as routerTool from '../../../tools/router'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as themeEnum from '../../../enums/theme'
import EachTops from '../blocks/EachTops'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  main: {
    alignItems: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    paddingBottom: '1.5rem',
  },
  left: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  leftTitle: {
    margin: '2rem 0 1rem 0.5rem !important',
  },
  right: {
    width: '28rem',
  },
}))

const TickerDetail = () => {
  const params = useParams()
  const classes = useStyles()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTickerIdentities } = useTickerState()
  const { getTraderEnv, getTickerDetail, fetchTickerDetail } = useTraderState()
  const { getUser } = useUserState()
  const user = getUser()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : null
  const envId = params.envId ? parseInt(params.envId) : 1

  const tickerIdentities = getTickerIdentities()
  const tickerIdentity = tickerIdentities.find((identity) => identity.id === tickerId) || null

  const tickerDetail = getTickerDetail(envId, tickerId)
  const topProfiles = tickerDetail?.tops
  const traderEnv = getTraderEnv(envId)
  const traderEnvName = parseTool.traderEnvName(traderEnv)

  const bestOverall = topProfiles?.yearly[0] || null
  const bestPastYear = topProfiles?.pastYear[0] || null
  const bestPastQuarter = topProfiles?.pastQuarter[0] || null
  const bestPastMonth = topProfiles?.pastMonth[0] || null
  const bestPastWeek = topProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!tickerId || !envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
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

  // ------------------------------------------------------------ Interface --

  if (!tickerIdentity) return null

  return (
    <section className={classNames('row-between', classes.main)}>
      <section className={classes.left}>
        <header className={classNames('row-start', classes.header)}>
          <TickerLabel ticker={tickerIdentity} color='grey' />
          <h4 className={classes.desc}>
            {tickerIdentity.name}
          </h4>
        </header>
        <Header
          as='h3'
          icon='star'
          content={localeTool.t('availableTickers.topProfiles', { name: traderEnvName })}
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
      <aside className={classes.right}>
        {user.userTraderEnvIds.map((traderEnvId) => (
          <TraderEnvCard
            key={traderEnvId}
            traderEnv={getTraderEnv(traderEnvId)}
            isActive={envId === traderEnvId}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default TickerDetail
