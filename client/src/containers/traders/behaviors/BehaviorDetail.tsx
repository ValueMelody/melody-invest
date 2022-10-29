import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderRequest from 'requests/useTraderRequest'
import useTraderState from 'states/useTraderState'
import EachTops from 'containers/traders/blocks/EachTops'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import BehaviorLabel from 'containers/traders/elements/BehaviorLabel'
import PageTitle from 'containers/elements/PageTitle'

const BehaviorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getTraderBehavior, getTraderEnv, getTraderEnvs } = useTraderState()
  const { fetchTraderBehavior } = useTraderRequest()

  const behavior = params.behavior || null
  const envId = params.envId ? parseInt(params.envId) : 1
  const validBehavior = constants.Behavior.Behaviors.find((value) => value === behavior) || null
  const behaviorDetail = getTraderBehavior(envId, validBehavior)
  const topTraderProfiles = behaviorDetail?.tops

  const traderEnvs = getTraderEnvs()
  const traderEnv = getTraderEnv(envId)

  const bestOverall = topTraderProfiles?.yearly[0] || null
  const bestPastYear = topTraderProfiles?.pastYear[0] || null
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0] || null
  const bestPastMonth = topTraderProfiles?.pastMonth[0] || null
  const bestPastWeek = topTraderProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!validBehavior) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (behaviorDetail || !validBehavior || !envId) return
    fetchTraderBehavior(envId, validBehavior)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behaviorDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = (traderEnvId: number) => {
    const url = routerTool.behaviorDetailRoute(traderEnvId, validBehavior!)
    navigate(url)
  }

  // ------------------------------------------------------------ UI --

  if (!validBehavior || !traderEnv) return null

  return (
    <section className='page-root'>
      <section className='page-main'>
        <header className='detail-header'>
          <BehaviorLabel
            behavior={validBehavior}
            color='info'
            className='mr-4'
          />
          <h1 className='font-bold text-xl'>
            {parseTool.behaviorDesc(validBehavior)}
          </h1>
        </header>
        <PageTitle
          title={localeTool.t('tradeBehaviors.topProfiles', { name: traderEnv.record.name })}
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
            key={traderEnv.record.id}
            className='w-80 mb-4'
            traderEnv={traderEnv.record}
            isActive={envId === traderEnv.record.id}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default BehaviorDetail
