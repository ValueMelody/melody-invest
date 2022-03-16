import { useEffect } from 'react'
import useUser from '../../states/useUser'

const Dashboard = () => {
  const { fetchUserFollowed } = useUser()

  useEffect(() => {
    fetchUserFollowed()
  }, [])

  return (
    <div>dashboard</div>
  )
}

export default Dashboard
