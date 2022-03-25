import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import useUser from '../../states/useUser'
import useTraderProfile from '../../states/useTraderProfile'
import ProfileRow from './blocks/ProfileRow'
import * as localeTool from '../../tools/locale'
import * as routerEnum from '../../enums/router'

const useStyles = createUseStyles(({
  header: {
    marginBottom: '1rem',
  },
}))

const ProfileDashboard = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { userTraderIds } = useUser()
  const { getTraderProfile } = useTraderProfile()

  const handleClickBuild = () => {
    navigate(`${routerEnum.NAV.PROFILES}/build`)
  }

  if (!userTraderIds) return null

  return (
    <div>
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
          <ProfileRow
            key={traderId}
            trader={profile.trader}
            pattern={profile.pattern}
          />
        )
      })}
    </div>
  )
}

export default ProfileDashboard
