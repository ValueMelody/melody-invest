import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useUserState from '../../states/useUserState'
import useTraderState from '../../states/useTraderState'
import * as localeTool from '../../tools/locale'
import * as routerEnum from '../../enums/router'
import usePrivateGuard from '../hooks/usePrivateGuard'
import ProfileCard from './blocks/ProfileCard'
import TraderEnvCard from './elements/TraderEnvCard'

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
  usePrivateGuard()

  const { userTraderIds, userTraderEnvIds } = useUserState()
  const { getTraderProfile, getTraderEnv } = useTraderState()

  const handleClickBuildProfile = () => {
    navigate(`${routerEnum.NAV.PROFILES}/build`)
  }

  const handleClickAddEnv = () => {
    navigate(`${routerEnum.NAV.PROFILES}/envs/build`)
  }

  const handleClickRow = (trader: interfaces.traderModel.Record) => {
    const link = `${routerEnum.NAV.PROFILES}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  if (!userTraderIds) return null

  return (
    <div className={classNames('row-between', classes.container)}>
      <div className={classes.left}>
        <div className={classNames('row-between', classes.header)}>
          <h2>{localeTool.t('dashboard.watchedProfiles')}:</h2>
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
        {userTraderIds.map((traderId) => {
          const profile = getTraderProfile(traderId)
          if (!profile) return null
          return (
            <ProfileCard
              key={traderId}
              trader={profile.trader}
              pattern={profile.pattern}
              onClick={handleClickRow}
            />
          )
        })}
      </div>
      <div className={classes.right}>
        <h2>{localeTool.t('dashboard.watchedEnvs')}:</h2>
        {userTraderEnvIds.map((envId) => {
          const traderEnv = getTraderEnv(envId)!
          return (
            <TraderEnvCard
              key={traderEnv.id}
              traderEnv={traderEnv}
              isActive={false}
            />
          )
        })}
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
