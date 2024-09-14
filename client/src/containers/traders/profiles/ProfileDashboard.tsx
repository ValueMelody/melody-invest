import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import AddButton from 'containers/traders/elements/AddButton'
import { Alert } from 'flowbite-react'
import PageTitle from 'containers/elements/PageTitle'
import TraderComboCard from 'containers/traders/blocks/TraderComboCard'
import TraderEnvCard from 'containers/traders/blocks/TraderEnvCard'
import TraderProfileCard from 'containers/traders/blocks/TraderProfileCard'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import usePrivateGuard from 'hooks/usePrivateGuard'
import { useSelector } from 'react-redux'

const asideHeaderClass = 'flex justify-between items-center mb-4'

const ProfileDashboard = () => {
  usePrivateGuard()

  const navigate = useNavigate()

  const envs = useSelector(selectors.selectTraderEnvBases())
  const combos = useSelector(selectors.selectTraderComboBases())
  const user = useSelector(selectors.selectUser())
  const profileDict = useSelector(selectors.selectTraderProfileBaseDict())

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
            disabled={!user.access.canFollowTrader || !envs.length}
            title={localeTool.t('dashboard.newBtn')}
            tooltip={
              user.access.canFollowTrader
                ? localeTool.t('dashboard.newProfileDesc')
                : localeTool.t('permission.limited')
            }
          />
        </header>
        {!user.userTraderIds.length && (
          <Alert color='gray'>
            {localeTool.t('dashboard.emptyProfiles')}
          </Alert>
        )}
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
        <section className={asideHeaderClass}>
          <PageTitle
            icon='bookmark'
            title={localeTool.t('dashboard.watchedEnvs')}
          />
          <AddButton
            data-testid='addEnvBtn'
            onClick={handleClickAddEnv}
            disabled={!user.access.canFollowEnv}
            title={localeTool.t('dashboard.newBtn')}
            tooltip={
              user.access.canFollowEnv
                ? localeTool.t('dashboard.newEnvDesc')
                : localeTool.t('permission.limited')
            }
          />
        </section>
        {!envs.length && (
          <Alert
            color='gray'
            className='w-80 mb-4'
          >
            {localeTool.t('dashboard.emptyEnvs')}
          </Alert>
        )}
        {envs.map((env) => (
          <TraderEnvCard
            key={env.id}
            className='w-80 mb-4'
            traderEnv={env}
            onClick={handleClickEnv}
          />
        ))}
        <section className={classNames(asideHeaderClass, 'mt-8')}>
          <PageTitle
            icon='boxes'
            title={localeTool.t('dashboard.watchedCombos')}
          />
          <AddButton
            data-testid='addComboBtn'
            onClick={handleClickAddCombo}
            disabled={!user.access.canFollowCombo || !user.userTraderIds.length}
            title={localeTool.t('dashboard.newBtn')}
            tooltip={
              user.access.canFollowCombo
                ? localeTool.t('dashboard.newComboDesc')
                : localeTool.t('permission.limited')
            }
          />
        </section>
        {!combos.length && (
          <Alert
            color='gray'
            className='w-80 mb-4'
          >
            {localeTool.t('dashboard.emptyCombos')}
          </Alert>
        )}
        {combos.map((combo) => (
          <TraderComboCard
            key={combo.id}
            className='w-80 mb-4'
            traderCombo={combo}
            onClick={handleClickCombo}
          />
        ))}
      </aside>
    </section>
  )
}

export default ProfileDashboard
