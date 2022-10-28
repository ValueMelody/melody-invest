import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useUserState from 'states/useUserState'
import useTraderState from 'states/useTraderState'
import { createUseStyles } from 'react-jss'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import useTraderStyle from 'styles/useTraderStyle'
import useCommonStyle from 'styles/useCommonStyle'
import usePrivateGuard from 'handlers/usePrivateGuard'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import AddButton from 'containers/traders/elements/AddButton'
import PageTitle from 'containers/elements/PageTitle'

const useStyles = createUseStyles(({
  header: {
    marginBottom: '1rem',
  },
  card: {
    width: 290,
    marginBottom: '3rem',
    paddingTop: '1rem',
  },
}))

const ProfileDashboard = () => {
  usePrivateGuard()

  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()
  const { traderClasses } = useTraderStyle()

  const { getUser } = useUserState()
  const { getTraderProfile, getTraderCombos, getTraderEnvs } = useTraderState()

  const user = getUser()
  const envs = getTraderEnvs()
  const combos = getTraderCombos()

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

  const handleClickCombo = (comboId: number) => {
    const link = routerTool.comboDetailRoute(comboId)
    navigate(link)
  }

  // ------------------------------------------------------------ UI --

  if (!user.userType) return null

  return (
    <section className={traderClasses.root}>
      <section className={traderClasses.main}>
        <header className={classNames(
          commonClasses.rowBetween,
          classes.header,
        )}>
          <PageTitle
            title={localeTool.t('dashboard.watchedProfiles')}
          />
          <div
            data-tooltip={
              user.canFollowTrader ? localeTool.t('dashboard.newProfileDesc') : localeTool.t('permission.limited')
            }
            data-position='bottom center'
          >
            <AddButton
              onClick={handleClickAddProfile}
              disabled={!user.canFollowTrader}
              title={localeTool.t('common.new')}
            />
          </div>
        </header>
        {user.userTraderIds.map((traderId) => (
          <TraderProfileCard
            key={traderId}
            disabledUnwatch={user.accessibleTraderIds.includes(traderId)}
            disabled={!user.accessibleTraderIds.includes(traderId)}
            profile={getTraderProfile(traderId)}
            onClick={handleClickRow}
          />
        ))}
      </section>
      <aside className={traderClasses.aside}>
        <PageTitle
         icon='bookmark'
         title={localeTool.t('dashboard.watchedEnvs')}
        />
        <section className={classNames(
          commonClasses.rowCenter,
          classes.card,
        )}>
          {envs.map((env) => (
            <TraderEnvCard
              key={env.record.id}
              traderEnv={env.record}
              onClick={handleClickEnv}
            />
          ))}
          <div
            data-tooltip={
              user.canFollowEnv ? localeTool.t('dashboard.newEnvDesc') : localeTool.t('permission.limited')
            }
            data-position='bottom center'
          >
            <AddButton
              onClick={handleClickAddEnv}
              disabled={!user.canFollowEnv}
              title={localeTool.t('common.new')}
            />
          </div>
        </section>
        <PageTitle
         icon='boxes'
         title={localeTool.t('dashboard.watchedCombos')}
        />
        <section className={classNames(
          commonClasses.rowCenter,
          classes.card,
        )}>
          {userCombos.map((combo) => (
            <TraderComboCard
              key={combo.identity.id}
              traderCombo={combo.identity}
              onClick={handleClickCombo}
            />
          ))}
          <div
            data-tooltip={
              user.canFollowCombo ? localeTool.t('dashboard.newComboDesc') : localeTool.t('permission.limited')
            }
            data-position='bottom center'
          >
            <AddButton
              onClick={handleClickAddCombo}
              disabled={!user.canFollowCombo}
              title={localeTool.t('common.new')}
            />
          </div>
        </section>
      </aside>
    </section>
  )
}

export default ProfileDashboard
