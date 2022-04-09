import * as interfaces from '@shared/interfaces'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import usePrivateGuard from '../../hooks/usePrivateGuard'
import ProfileCard from '../blocks/ProfileCard'
import TraderEnvCard from '../elements/TraderEnvCard'

const useStyles = vendorTool.jss.createUseStyles(({
  container: {
    alignItems: 'flex-start',
  },
  header: {
    marginBottom: '1rem',
  },
  left: {
    width: 'calc(100% - 32rem)',
    minWidth: '28rem',
  },
  right: {
    width: '28rem',
  },
  card: {
    width: 290,
  },
}))

const ProfileDashboard = () => {
  const classes = useStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const { getUser } = useUserState()
  const { getTraderProfile } = useTraderState()

  const user = getUser()

  // ------------------------------------------------------------ Handler --

  const handleClickBuildProfile = () => {
    navigate(routerTool.profileBuildRoute())
  }

  const handleClickAddEnv = () => {
    navigate(routerTool.envBuildRoute())
  }

  const handleClickRow = (trader: interfaces.traderModel.Record) => {
    const link = routerTool.profileDetailRoute(trader.id, trader.accessCode)
    navigate(link)
  }

  const handleClickEnv = (envId: number) => {
    const link = routerTool.envDetailRoute(envId)
    navigate(link)
  }

  // ------------------------------------------------------------ Interface --

  if (!user.userTraderIds) return null

  return (
    <div className={vendorTool.classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <div className={vendorTool.classNames('row-between', classes.header)}>
          <vendorTool.ui.Header
            as='h3'
            icon='star'
            content={localeTool.t('dashboard.watchedProfiles')}
          />
          <vendorTool.ui.Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickBuildProfile}
            title={localeTool.t('dashboard.buildDesc')}
          >
            <vendorTool.ui.Icon name='cogs' />
            {localeTool.t('common.build')}
          </vendorTool.ui.Button>
        </div>
        {user.userTraderIds.map((traderId) => (
          <ProfileCard
            key={traderId}
            profile={getTraderProfile(traderId)}
            onClick={handleClickRow}
          />
        ))}
      </div>
      <div className={classes.right}>
        <vendorTool.ui.Header
          as='h3'
          icon='bookmark'
          content={localeTool.t('dashboard.watchedEnvs')}
        />
        {user.userTraderEnvs.map((env) => (
          <TraderEnvCard
            key={env.id}
            traderEnv={env}
            isActive={false}
            onClick={handleClickEnv}
          />
        ))}
        <div className={vendorTool.classNames('row-center', classes.card)}>
          <vendorTool.ui.Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickAddEnv}
            title={localeTool.t('dashboard.newDesc')}
          >
            <vendorTool.ui.Icon name='plus' />
            {localeTool.t('common.new')}
          </vendorTool.ui.Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboard
