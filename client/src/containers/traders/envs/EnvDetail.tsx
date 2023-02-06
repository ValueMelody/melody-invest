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

  const envId = params.envId ? parseInt(params.envId) : undefined
  const envRecord = useSelector(selectors.selectTraderEnvBaseById(envId))
  const envDetail = useSelector(selectors.selectTraderEnvDetailById(envId))

  const topTraderProfiles = envDetail?.topProfiles

  const bestOverall = topTraderProfiles?.yearly[0]
  const bestPastYear = topTraderProfiles?.pastYear[0]
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0]
  const bestPastMonth = topTraderProfiles?.pastMonth[0]
  const bestPastWeek = topTraderProfiles?.pastWeek[0]

  useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
  }, [envId, navigate])

  useEffect(() => {
    if (!envId || !envRecord || topTraderProfiles) return
    dispatch(actions.fetchTraderEnvDetail(envId))
  }, [envId, envRecord, topTraderProfiles, dispatch])

  const handleClickTicker = (tickerId: number) => {
    if (!envId) return
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
        <div className='flex flex-wrap mb-4'>
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
