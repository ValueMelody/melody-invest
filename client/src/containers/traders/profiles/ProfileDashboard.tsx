import * as interfaces from '@shared/interfaces'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import usePrivateGuard from '../../hooks/usePrivateGuard'
import ProfileCard from '../blocks/ProfileCard'
import TraderEnvCard from '../elements/TraderEnvCard'
import TraderComboCard from '../elements/TraderComboCard'

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
    marginBottom: '3rem',
    paddingTop: '1rem',
  },
}))

const ProfileDashboard = () => {
  const classes = useStyles()
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const { getUser } = useUserState()
  const { getProfileDetail } = useTraderState()

  const user = getUser()
  const combos = user.userTraderCombos
  const userCombos = combos.filter((combo) => !combo.identity.isSystem)

  // ------------------------------------------------------------ Handler --

  const handleClickAddProfile = () => {
    navigate(routerTool.profileBuildRoute())
  }

  const handleClickAddEnv = () => {
    navigate(routerTool.envBuildRoute())
  }

  const handleClickAddCombo = () => {
    navigate(routerTool.comboBuildRoute())
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
    <section className={vendorTool.classNames('row-between', classes.container)}>
      <section className={classes.left}>
        <header className={vendorTool.classNames('row-between', classes.header)}>
          <vendorTool.ui.Header
            as='h3'
            icon='star'
            content={localeTool.t('dashboard.watchedProfiles')}
          />
          <vendorTool.ui.Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickAddProfile}
            title={localeTool.t('dashboard.newProfileDesc')}
          >
            <vendorTool.ui.Icon name='plus' />
            {localeTool.t('common.new')}
          </vendorTool.ui.Button>
        </header>
        {user.userTraderIds.map((traderId) => (
          <ProfileCard
            key={traderId}
            profile={getProfileDetail(traderId)}
            onClick={handleClickRow}
          />
        ))}
      </section>
      <aside className={classes.right}>
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
        <section className={vendorTool.classNames('row-center', classes.card)}>
          <vendorTool.ui.Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickAddEnv}
            title={localeTool.t('dashboard.newEnvDesc')}
          >
            <vendorTool.ui.Icon name='plus' />
            {localeTool.t('common.new')}
          </vendorTool.ui.Button>
        </section>
        <vendorTool.ui.Header
          as='h3'
          icon='boxes'
          content={localeTool.t('dashboard.watchedCombos')}
        />
        <section className={vendorTool.classNames('row-center', classes.card)}>
          {userCombos.map((combo) => {
            const env = user.userTraderEnvs.find((env) => env.id === combo.identity.traderEnvId) || null
            return (
              <TraderComboCard
                key={combo.identity.id}
                traderCombo={combo.identity}
                traderEnv={env}
              />
            )
          })}
          <vendorTool.ui.Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickAddCombo}
            title={localeTool.t('dashboard.newComboDesc')}
          >
            <vendorTool.ui.Icon name='plus' />
            {localeTool.t('common.new')}
          </vendorTool.ui.Button>
        </section>
      </aside>
    </section>
  )
}

export default ProfileDashboard
