import useUser from '../../states/useUser'
import useTraderProfile from '../../states/useTraderProfile'
import ProfileRow from './blocks/ProfileRow'

const Dashboard = () => {
  const { userTraderIds } = useUser()
  const { getTraderProfile } = useTraderProfile()

  if (!userTraderIds) return null

  return (
    <div>
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

export default Dashboard
