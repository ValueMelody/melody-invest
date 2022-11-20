import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import BehaviorLabel from 'containers/traders/elements/BehaviorLabel'
import EachTops from 'containers/traders/blocks/EachTops'
import PageTitle from 'containers/elements/PageTitle'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import { useEffect } from 'react'

const BehaviorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const behavior = params.behavior
  const envId = params.envId ? parseInt(params.envId) : 1
  const validBehavior = constants.Behavior.Behaviors.find((value) => value === behavior)
  const behaviorDetail = useSelector(selectors.selectTraderBehaviorDetail(envId, validBehavior))
  const topTraderProfiles = behaviorDetail?.topProfiles

  const traderEnvs = useSelector(selectors.selectTraderEnvBases())
  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(envId))

  const bestOverall = topTraderProfiles?.yearly[0]
  const bestPastYear = topTraderProfiles?.pastYear[0]
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0]
  const bestPastMonth = topTraderProfiles?.pastMonth[0]
  const bestPastWeek = topTraderProfiles?.pastWeek[0]

  useEffect(() => {
    if (!validBehavior) navigate(routerTool.notFoundRoute())
  }, [navigate, validBehavior])

  useEffect(() => {
    if (behaviorDetail || !validBehavior || !envId) return
    dispatch(actions.fetchTraderBehaviorDetail({ envId, behavior: validBehavior }))
  }, [behaviorDetail, validBehavior, envId, dispatch])

  const handleClickEnv = (traderEnvId: number) => {
    const url = routerTool.behaviorDetailRoute(traderEnvId, validBehavior!)
    navigate(url)
  }

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
          title={localeTool.t('tradeBehaviors.topProfiles', { name: parseTool.traderEnvName(traderEnv) })}
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

export default BehaviorDetail
