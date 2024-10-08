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
import usePrivateGuard from 'hooks/usePrivateGuard'

const BehaviorDetail = () => {
  usePrivateGuard()
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const behavior = params.behavior
  const envId = Number(params.envId)
  const validBehavior = constants.Behavior.Behaviors.find((value) => value === behavior)
  const behaviorDetail = useSelector(selectors.selectTraderBehaviorDetail(envId, validBehavior))
  const topTraderProfiles = behaviorDetail?.topProfiles

  const traderEnvs = useSelector(selectors.selectTraderEnvBases())
  const traderEnv = useSelector(selectors.selectTraderEnvBaseById(envId))

  const bestOveralls = topTraderProfiles?.yearly || []
  const bestPastYears = topTraderProfiles?.pastYear || []
  const bestPastQuarters = topTraderProfiles?.pastQuarter || []
  const bestPastMonths = topTraderProfiles?.pastMonth || []
  const bestPastWeeks = topTraderProfiles?.pastWeek || []

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
    <section
      data-testid='detail-root'
      className='detail-root'
    >
      <header className='detail-header'>
        <section className='flex'>
          <BehaviorLabel
            behavior={validBehavior}
            color='info'
            className='mr-4'
          />
          <h1 className='font-bold text-xl'>
            {parseTool.behaviorDesc(validBehavior)}
          </h1>
        </section>
      </header>
      <section className='page-root'>
        <section className='page-main'>
          <PageTitle
            title={localeTool.t('tradeBehaviors.topProfiles', { name: traderEnv.name })}
          />
          <EachTops
            bestOveralls={bestOveralls}
            bestPastYears={bestPastYears}
            bestPastQuarters={bestPastQuarters}
            bestPastMonths={bestPastMonths}
            bestPastWeeks={bestPastWeeks}
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

export default BehaviorDetail
