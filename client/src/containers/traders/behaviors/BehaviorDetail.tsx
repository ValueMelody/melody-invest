import * as constants from '@shared/constants'
import { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from 'semantic-ui-react'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as routerEnum from '../../../enums/router'
import * as themeEnum from '../../../enums/theme'
import EachTops from '../blocks/EachTops'
import BehaviorLabel from '../elements/BehaviorLabel'
import TraderEnvCard from '../elements/TraderEnvCard'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  main: {
    alignItems: 'flex-start',
  },
  desc: {
    marginLeft: '1rem !important',
  },
  header: {
    borderBottom: `3px solid ${theme.PRIMARY_COLOR}`,
    paddingBottom: '1.5rem',
  },
  left: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  leftTitle: {
    margin: '2rem 0 1rem 0.5rem !important',
  },
  right: {
    width: '28rem',
  },
}))

const BehaviorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const classes = useStyles()

  // ------------------------------------------------------------ State --
  const { getUser } = useUserState()
  const { getTraderEnv, getBehaviorDetail, fetchBehaviorDetail } = useTraderState()
  const user = getUser()

  const behavior = params.behavior || null
  const envId = params.envId ? parseInt(params.envId) : 1
  const validBehavior = constants.behavior.behaviors.find((value) => value === behavior) || null
  const behaviorDetail = getBehaviorDetail(envId, validBehavior)
  const topProfiles = behaviorDetail?.tops
  const traderEnv = getTraderEnv(envId)
  const traderEnvName = parseTool.traderEnvName(traderEnv)

  const bestOverall = topProfiles?.yearly[0] || null
  const bestPastYear = topProfiles?.pastYear[0] || null
  const bestPastQuarter = topProfiles?.pastQuarter[0] || null
  const bestPastMonth = topProfiles?.pastMonth[0] || null
  const bestPastWeek = topProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  useEffect(() => {
    if (!validBehavior) navigate(routerEnum.NAV.NOT_FOUND)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (behaviorDetail || !validBehavior || !envId) return
    fetchBehaviorDetail(envId, validBehavior)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [behaviorDetail])

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = (traderEnvId: number) => {
    const url = `${routerEnum.NAV.BEHAVIORS}/${behavior}/envs/${traderEnvId}`
    navigate(url)
  }

  // ------------------------------------------------------------ Interface --

  if (!validBehavior) return null

  return (
    <section className={classNames('row-between', classes.main)}>
      <section className={classes.left}>
        <header className={classNames('row-start', classes.header)}>
          <BehaviorLabel behavior={validBehavior} color='blue' />
          <h4 className={classes.desc}>
            {parseTool.behaviorDesc(validBehavior)}
          </h4>
        </header>
        <Header
          as='h3'
          icon='star'
          content={localeTool.t('tradeBehaviors.topProfiles', { name: traderEnvName })}
          className={classes.leftTitle}
        />
        <section className='row-start'>
          <EachTops
            bestOverall={bestOverall}
            bestPastYear={bestPastYear}
            bestPastQuarter={bestPastQuarter}
            bestPastMonth={bestPastMonth}
            bestPastWeek={bestPastWeek}
          />
        </section>
      </section>
      <aside className={classes.right}>
        {user.userTraderEnvIds.map((traderEnvId) => (
          <TraderEnvCard
            key={traderEnvId}
            traderEnv={getTraderEnv(traderEnvId)}
            isActive={envId === traderEnvId}
            onClick={handleClickEnv}
          />
        ))}
      </aside>
    </section>
  )
}

export default BehaviorDetail
