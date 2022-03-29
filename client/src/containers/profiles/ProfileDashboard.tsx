import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import useUserState from '../../states/useUserState'
import useTraderState from '../../states/useTraderState'
import useSystemState from '../../states/useSystemState'
import useTraderEnvState from '../../states/useTraderEnvState'
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
}))

const ProfileDashboard = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  usePrivateGuard()

  const { userTraderIds } = useUserState()
  const { getTraderProfile } = useTraderState()
  const { systemTraderEnvIds } = useSystemState()
  const { getTraderEnv } = useTraderEnvState()

  const handleClickBuild = () => {
    navigate(`${routerEnum.NAV.PROFILES}/build`)
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
            onClick={handleClickBuild}
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
        <h2>{localeTool.t('dashboard.defaultEnvs')}</h2>
          {systemTraderEnvIds.map((envId) => {
            const traderEnv = getTraderEnv(envId)!
            return (
              <TraderEnvCard
                key={traderEnv.id}
                traderEnv={traderEnv}
                isActive={false}
              />
            )
          })}
      </div>
    </div>
  )
}

export default ProfileDashboard
