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

const useStyles = createUseStyles(({
  header: {
    marginBottom: '1rem',
  },
  profiles: {
    width: '60%',
    minWidth: '26rem',
  },
}))

const ProfileDashboard = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  usePrivateGuard()

  const { userTraderIds } = useUserState()
  const { getTraderProfile } = useTraderState()

  const handleClickBuild = () => {
    navigate(`${routerEnum.NAV.PROFILES}/build`)
  }

  const handleClickRow = (trader: interfaces.traderModel.Record) => {
    const link = `${routerEnum.NAV.PROFILES}/${trader.id}/${trader.accessCode}`
    navigate(link)
  }

  if (!userTraderIds) return null

  return (
    <div className='row-between'>
      <div className={classes.profiles}>
        <div className={classNames('row-between', classes.header)}>
          <h3>{localeTool.t('dashboard.watchedProfiles')}:</h3>
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
    </div>
  )
}

export default ProfileDashboard
