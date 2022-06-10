import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import EachTops from '../blocks/EachTops'
import BehaviorLabel from '../elements/BehaviorLabel'
import TraderEnvCard from '../elements/TraderEnvCard'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import usePageStyles from '../../hooks/usePageStyles'

const useStyles = vendorTool.jss.createUseStyles((
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
  const params = vendorTool.router.useParams()
  const navigate = vendorTool.router.useNavigate()
  const classes = useStyles()
  const { classes: pageClasses } = usePageStyles()

  // ------------------------------------------------------------ State --
  const { getUser } = useUserState()
  const { getBehaviorDetail, fetchBehaviorDetail } = useTraderState()
  const user = getUser()

  const behavior = params.behavior || null
  const envId = params.envId ? parseInt(params.envId) : 1
  const validBehavior = constants.Behavior.Behaviors.find((value) => value === behavior) || null
  const behaviorDetail = getBehaviorDetail(envId, validBehavior)
  const topTraderProfiles = behaviorDetail?.tops
  const traderEnv = user.userTraderEnvs.find((env) => env.id === envId) || null

  const bestOverall = topTraderProfiles?.yearly[0] || null
  const bestPastYear = topTraderProfiles?.pastYear[0] || null
  const bestPastQuarter = topTraderProfiles?.pastQuarter[0] || null
  const bestPastMonth = topTraderProfiles?.pastMonth[0] || null
  const bestPastWeek = topTraderProfiles?.pastWeek[0] || null

  // ------------------------------------------------------------ Effect --

  vendorTool.react.useEffect(() => {
    if (!validBehavior) navigate(routerTool.notFoundRoute())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  vendorTool.react.useEffect(() => {
    if (behaviorDetail || !validBehavior || !envId) return
    fetchBehaviorDetail(envId, validBehavior)
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
    <section className={pageClasses.root}>
      <section className={pageClasses.main}>
        <header className={vendorTool.classNames('row-start', classes.header)}>
          <BehaviorLabel behavior={validBehavior} color='blue' />
          <h4 className={classes.desc}>
            {parseTool.behaviorDesc(validBehavior)}
          </h4>
        </header>
        <vendorTool.ui.Header
          as='h3'
          icon='star'
          content={localeTool.t('tradeBehaviors.topProfiles', { name: traderEnv.name })}
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
      <aside className={pageClasses.aside}>
        {user.userTraderEnvs.map((traderEnv) => (
          <TraderEnvCard
            key={traderEnv.id}
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
