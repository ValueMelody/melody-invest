import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderRequest from 'requests/useTraderRequest'
import useTraderState from 'states/useTraderState'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import EachTops from 'containers/traders/blocks/EachTops'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import BehaviorLabel from 'containers/traders/elements/BehaviorLabel'
import PageTitle from 'containers/elements/PageTitle'

const useStyles = createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PrimaryColor}`,
    paddingBottom: '1.5rem',
  },
  leftTitle: {
    margin: '2rem 0 1rem 0.5rem !important',
  },
}))

const BehaviorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { traderClasses } = useTraderStyle()
  const { commonClasses } = useCommonStyle()

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
    <section className={traderClasses.root}>
      <section className={traderClasses.main}>
        <header className={classNames(
          commonClasses.rowStart,
          classes.header,
        )}>
          <BehaviorLabel behavior={validBehavior} color='info' />
          <h4 className={classes.desc}>
            {parseTool.behaviorDesc(validBehavior)}
          </h4>
        </header>
        <PageTitle
          className={classes.leftTitle}
          title={localeTool.t('tradeBehaviors.topProfiles', { name: traderEnv.record.name })}
        />
        <section className={commonClasses.rowStart}>
          <EachTops
            bestOverall={bestOverall}
            bestPastYear={bestPastYear}
            bestPastQuarter={bestPastQuarter}
            bestPastMonth={bestPastMonth}
            bestPastWeek={bestPastWeek}
          />
        </section>
      </section>
      <aside className={traderClasses.aside}>
        {traderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.record.id}
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
