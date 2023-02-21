import * as actions from 'actions'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import EachTops from 'containers/traders/blocks/EachTops'
import PageTitle from 'containers/elements/PageTitle'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import { useEffect } from 'react'

const TickerDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const tickerId = Number(params.tickerId)
  const envId = Number(params.envId)

  const hasTicker = useSelector(selectors.selectHasTickerIdentity())
  const traderEnvs = useSelector(selectors.selectTraderEnvBases())
  const tickerIdentity = useSelector(selectors.selectTickerIdentityBaseById(tickerId))
  const tickerDetail = useSelector(selectors.selectTickerIdentityDetail(envId, tickerId))

  const topTraderProfiles = tickerDetail?.topProfiles
  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(envId))

  const bestOverall = topTraderProfiles?.yearly[0]
  const bestPastYear = topTraderProfiles?.pastYear[0]
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0]
  const bestPastMonth = topTraderProfiles?.pastMonth[0]
  const bestPastWeek = topTraderProfiles?.pastWeek[0]

  useEffect(() => {
    const hasNoTicker = hasTicker && !tickerIdentity
    if (hasNoTicker) navigate(routerTool.notFoundRoute())
  }, [tickerIdentity, hasTicker, navigate])

  useEffect(() => {
    if (tickerDetail || !tickerId || !envId) return
    dispatch(actions.fetchTraderTickerDetail({ envId, tickerId }))
  }, [tickerDetail, tickerId, envId, dispatch])

  const handleClickEnv = (envId: number) => {
    const url = routerTool.tickerDetailRoute(envId, tickerId!)
    navigate(url)
  }

  if (!tickerIdentity || !traderEnv) return null

  return (
    <section
      data-testid='detail-root'
      className='detail-root'
    >
      <header className='detail-header'>
        <section className='flex'>
          <TickerLabel
            className='mr-4'
            ticker={tickerIdentity}
            color='gray'
          />
          <h1
            data-testid='detail-title'
            className='font-bold text-xl'
          >
            {tickerIdentity.name} {tickerIdentity.isDelisted ? `(${localeTool.t('ticker.delisted')})` : ''}
          </h1>
        </section>
      </header>
      <section className='page-root'>
        <section className='page-main'>
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
    </section>
  )
}

export default TickerDetail
