import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTraderState from 'states/useTraderState'
import useTraderRequest from 'requests/useTraderRequest'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import EachTops from 'containers/traders/blocks/EachTops'
import PageTitle from 'containers/elements/PageTitle'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const TickerDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { fetchTraderTicker } = useTraderRequest()
  const { getTraderTicker } = useTraderState()

  const tickerId = params.tickerId ? parseInt(params.tickerId) : undefined
  const envId = params.envId ? parseInt(params.envId) : 1

  const traderEnvs = useSelector(selectors.selectTraderEnvBases())
  const tickerIdentity = useSelector(selectors.selectTickerIdentityBaseById(tickerId))

  const tickerDetail = getTraderTicker(envId, tickerId)
  const topTraderProfiles = tickerDetail?.tops
  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(envId))

  const bestOverall = topTraderProfiles?.yearly[0]
  const bestPastYear = topTraderProfiles?.pastYear[0]
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0]
  const bestPastMonth = topTraderProfiles?.pastMonth[0]
  const bestPastWeek = topTraderProfiles?.pastWeek[0]

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
    <section className='page-root'>
      <section className='page-main'>
        <header className='detail-header'>
          <TickerLabel
            className='mr-4'
            ticker={tickerIdentity}
            color='gray'
          />
          <h1 className='font-bold text-xl'>
            {tickerIdentity.name}
          </h1>
        </header>
        <PageTitle
          title={localeTool.t('availableTickers.topProfiles', { name: parseTool.traderEnvName(traderEnv) })}
        />
        <EachTops
          bestOverall={bestOverall}
          bestPastYear={bestPastYear}
          bestPastQuarter={bestPastQuarter}
          bestPastMonth={bestPastMonth}
          bestPastWeek={bestPastWeek}
        />
      </section>
      <aside className='page-aside'>
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
            className='w-80 mb-4'
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
