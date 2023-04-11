import * as actions from 'actions'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import EachTops from 'containers/traders/blocks/EachTops'
import PageTitle from 'containers/elements/PageTitle'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import { useEffect } from 'react'

const EnvDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const tickerIdentityBaseDict = useSelector(selectors.selectTickerIdentityBaseDict())

  const envId = Number(params.envId)
  const envRecord = useSelector(selectors.selectTraderEnvBaseById(envId))
  const envDetail = useSelector(selectors.selectTraderEnvDetailById(envId))

  const topTraderProfiles = envDetail?.topProfiles

  const bestOveralls = topTraderProfiles?.yearly || []
  const bestPastYears = topTraderProfiles?.pastYear || []
  const bestPastQuarters = topTraderProfiles?.pastQuarter || []
  const bestPastMonths = topTraderProfiles?.pastMonth || []
  const bestPastWeeks = topTraderProfiles?.pastWeek || []

  useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
  }, [envId, navigate])

  useEffect(() => {
    if (!envId || !envRecord || topTraderProfiles) return
    dispatch(actions.fetchTraderEnvDetail(envId))
  }, [envId, envRecord, topTraderProfiles, dispatch])

  const handleClickTicker = (tickerId: number) => {
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  if (!envRecord || !topTraderProfiles) return null

  return (
    <section className='detail-root'>
      <header className='detail-header'>
        <TraderEnvCard
          allowUnwatch={!envRecord.isSystem}
          className='w-80'
          traderEnv={envRecord}
        />
        <div className='flex flex-wrap my-4'>
          {envRecord.tickerIds && envRecord.tickerIds.map((tickerId) => (
            <TickerLabel
              color='info'
              className='m-2'
              key={tickerId}
              ticker={tickerIdentityBaseDict[tickerId]}
              onClick={handleClickTicker}
            />
          ))}
        </div>
      </header>
      <section className='detail-main'>
        <PageTitle
          title={localeTool.t('traderEnv.topProfiles')}
        />
        <section>
          <EachTops
            bestOveralls={bestOveralls}
            bestPastYears={bestPastYears}
            bestPastQuarters={bestPastQuarters}
            bestPastMonths={bestPastMonths}
            bestPastWeeks={bestPastWeeks}
          />
        </section>
      </section>
    </section>
  )
}

export default EnvDetail
