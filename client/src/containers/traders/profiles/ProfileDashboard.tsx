import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useUserState from 'states/useUserState'
import useTraderState from 'states/useTraderState'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import usePrivateGuard from 'handlers/usePrivateGuard'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import AddButton from 'containers/traders/elements/AddButton'
import PageTitle from 'containers/elements/PageTitle'
import { useSelector } from 'react-redux'
import * as selectors from 'selectors'

const ProfileDashboard = () => {
  usePrivateGuard()

  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const { getTraderProfile, getTraderCombos } = useTraderState()

  const user = getUser()
  const envs = useSelector(selectors.selectTraderEnvBases())
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
    <section className='page-root'>
      <section className='page-main'>
        <header className='flex justify-between items-center mb-4'>
          <PageTitle
            title={localeTool.t('dashboard.watchedProfiles')}
          />
          <AddButton
            onClick={handleClickAddProfile}
            disabled={!user.canFollowTrader}
            title={localeTool.t('common.new')}
            tooltip={
              user.canFollowTrader
                ? localeTool.t('dashboard.newProfileDesc')
                : localeTool.t('permission.limited')
            }
          />
        </header>
        {user.userTraderIds.map((traderId) => (
          <TraderProfileCard
            key={traderId}
            className='mb-6'
            disabledUnwatch={user.accessibleTraderIds.includes(traderId)}
            disabled={!user.accessibleTraderIds.includes(traderId)}
            profile={getTraderProfile(traderId)}
            onClick={handleClickRow}
          />
        ))}
      </section>
      <aside className='page-aside'>
        <PageTitle
          icon='bookmark'
          title={localeTool.t('dashboard.watchedEnvs')}
          className='mb-4'
        />
        {envs.map((env) => (
          <TraderEnvCard
            key={env.id}
            className='w-80 mb-4'
            traderEnv={env}
            onClick={handleClickEnv}
          />
        ))}
        <AddButton
          onClick={handleClickAddEnv}
          disabled={!user.canFollowEnv}
          title={localeTool.t('common.new')}
          tooltip={
            user.canFollowEnv
              ? localeTool.t('dashboard.newEnvDesc')
              : localeTool.t('permission.limited')
          }
        />
        <PageTitle
          icon='boxes'
          title={localeTool.t('dashboard.watchedCombos')}
          className='my-4'
        />
        {userCombos.map((combo) => (
          <TraderComboCard
            key={combo.identity.id}
            className='w-80 mb-4'
            traderCombo={combo.identity}
            onClick={handleClickCombo}
          />
        ))}
        <AddButton
          onClick={handleClickAddCombo}
          disabled={!user.canFollowCombo}
          title={localeTool.t('common.new')}
          tooltip={
            user.canFollowCombo
              ? localeTool.t('dashboard.newComboDesc')
              : localeTool.t('permission.limited')
          }
        />
      </aside>
    </section>
  )
}

export default ProfileDashboard
