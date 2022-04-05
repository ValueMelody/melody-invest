import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Button, Icon, Header } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useUserState from '../../../states/useUserState'
import useTraderState from '../../../states/useTraderState'
import * as localeTool from '../../../tools/locale'
import * as routerTool from '../../../tools/router'
import usePrivateGuard from '../../hooks/usePrivateGuard'
import ProfileCard from '../blocks/ProfileCard'
import TraderEnvCard from '../elements/TraderEnvCard'

const useStyles = createUseStyles(({
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
  const navigate = useNavigate()

  // ------------------------------------------------------------ State --

  usePrivateGuard()

  const { getUser } = useUserState()
  const { getTraderProfile, getTraderEnv } = useTraderState()

  const user = getUser()
  const traderEnvIds = [...user.userTraderEnvIds].reverse()

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
    <div className={classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <div className={classNames('row-between', classes.header)}>
          <Header
            as='h3'
            icon='star'
            content={localeTool.t('dashboard.watchedProfiles')}
          />
          <Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickBuildProfile}
            title={localeTool.t('dashboard.buildDesc')}
          >
            <Icon name='cogs' />
            {localeTool.t('common.build')}
          </Button>
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
        <Header
          as='h3'
          icon='star'
          content={localeTool.t('dashboard.watchedEnvs')}
        />
        {traderEnvIds.map((envId) => (
          <TraderEnvCard
            key={envId}
            traderEnv={getTraderEnv(envId)}
            isActive={false}
            onClick={handleClickEnv}
          />
        ))}
        <div className={classNames('row-center', classes.card)}>
          <Button
            icon
            labelPosition='left'
            color='blue'
            onClick={handleClickAddEnv}
            title={localeTool.t('dashboard.newDesc')}
          >
            <Icon name='plus' />
            {localeTool.t('common.new')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboard
