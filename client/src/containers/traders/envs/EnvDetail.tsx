import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useTraderState from 'states/useTraderState'
import useResourceState from 'states/useResourceState'
import useTraderRequest from 'requests/useTraderRequest'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import EachTops from 'containers/traders/blocks/EachTops'
import UnwatchEnvButton from 'containers/traders/blocks/UnwatchEnvButton'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import PageTitle from 'containers/elements/PageTitle'

const EnvDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

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

  useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
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
    <section className='page-root'>
      <section className='page-main'>
        <PageTitle
          title={localeTool.t('traderEnv.topProfiles')}
        />
        <section>
          <EachTops
            bestOverall={bestOverall}
            bestPastYear={bestPastYear}
            bestPastQuarter={bestPastQuarter}
            bestPastMonth={bestPastMonth}
            bestPastWeek={bestPastWeek}
          />
        </section>
      </section>
      <aside className='page-aside'>
        <TraderEnvCard
          className='w-80 mb-4'
          traderEnv={traderEnv.record}
        />
        <div className='flex flex-wrap mb-4'>
          {traderEnv.record.tickerIds && traderEnv.record.tickerIds.map((tickerId) => (
            <TickerLabel
              color='info'
              className='m-2'
              key={tickerId}
              ticker={getTickerIdentity(tickerId)}
              onClick={handleClickTicker}
            />
          ))}
        </div>
        {!traderEnv.record.isSystem && (
          <div>
            <UnwatchEnvButton traderEnv={traderEnv.record} />
          </div>
        )}
      </aside>
    </section>
  )
}

export default EnvDetail
