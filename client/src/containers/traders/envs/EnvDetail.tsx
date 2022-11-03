import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import EachTops from 'containers/traders/blocks/EachTops'
import UnwatchEnvButton from 'containers/traders/blocks/UnwatchEnvButton'
import TickerLabel from 'containers/traders/elements/TickerLabel'
import PageTitle from 'containers/elements/PageTitle'
import * as selectors from 'selectors'
import * as actions from 'actions'
import { useSelector, useDispatch } from 'react-redux'

const EnvDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ State --

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

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!envId) navigate(routerTool.notFoundRoute())
  }, [envId, navigate])

  useEffect(() => {
    if (!envId || !envRecord || topTraderProfiles) return
    dispatch(actions.fetchTraderEnvDetail(envId))
  }, [envId, envRecord, topTraderProfiles, dispatch])

  // ------------------------------------------------------------ Handler --

  const handleClickTicker = (tickerId: number) => {
    if (!envId) return
    const url = routerTool.tickerDetailRoute(envId, tickerId)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  if (!envRecord || !topTraderProfiles) return null

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
        {!envRecord.isSystem && (
          <div>
            <UnwatchEnvButton traderEnv={envRecord} />
          </div>
        )}
      </aside>
    </section>
  )
}

export default EnvDetail
