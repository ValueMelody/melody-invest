import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import AddButton from 'containers/traders/elements/AddButton'
import PageTitle from 'containers/elements/PageTitle'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import { useNavigate } from 'react-router-dom'
import usePrivateGuard from 'hooks/usePrivateGuard'
import { useSelector } from 'react-redux'

const ProfileDashboard = () => {
  usePrivateGuard()

  const navigate = useNavigate()

  const envs = useSelector(selectors.selectTraderEnvBases())
  const combos = useSelector(selectors.selectTraderComboBases())
  const user = useSelector(selectors.selectUser())
  const profileDict = useSelector(selectors.selectTraderProfileBaseDict())

  const userCombos = combos.filter((combo) => !combo.isSystem)

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

  if (!user.userType) return null

  return (
    <section
      data-testid='dashboard'
      className='page-root'
    >
      <section className='page-main'>
        <header className='flex justify-between items-center mb-4'>
          <PageTitle
            title={localeTool.t('dashboard.watchedProfiles')}
          />
          <AddButton
            data-testid='addProfileBtn'
            onClick={handleClickAddProfile}
            disabled={!user.access.canFollowTrader}
            title={localeTool.t('common.new')}
            tooltip={
              user.access.canFollowTrader
                ? localeTool.t('dashboard.newProfileDesc')
                : localeTool.t('permission.limited')
            }
          />
        </header>
        {user.userTraderIds.map((traderId) => (
          <TraderProfileCard
            key={traderId}
            className='mb-6'
            disabledUnwatch={user.access.accessibleTraderIds.includes(traderId)}
            disabled={!user.access.accessibleTraderIds.includes(traderId)}
            profile={profileDict[traderId]}
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
          data-testid='addEnvBtn'
          onClick={handleClickAddEnv}
          disabled={!user.access.canFollowEnv}
          title={localeTool.t('common.new')}
          tooltip={
            user.access.canFollowEnv
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
            key={combo.id}
            className='w-80 mb-4'
            traderCombo={combo}
            onClick={handleClickCombo}
          />
        ))}
        <AddButton
          data-testid='addComboBtn'
          onClick={handleClickAddCombo}
          disabled={!user.access.canFollowCombo}
          title={localeTool.t('common.new')}
          tooltip={
            user.access.canFollowCombo
              ? localeTool.t('dashboard.newComboDesc')
              : localeTool.t('permission.limited')
          }
        />
      </aside>
    </section>
  )
}

export default ProfileDashboard
