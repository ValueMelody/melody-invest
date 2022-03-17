import useUser from '../../../states/useUser'
import useCommon from '../../../states/useCommon'
import * as localeTool from '../../../tools/locale'

const useToggleWatch = ({
  traderId,
}: {
  traderId: number;
}) => {
  const { userType, userTraderIds, createUserFollowed, deleteUserFollowed } = useUser()
  const { addMessage } = useCommon()

  const isWatched = !!userTraderIds && userTraderIds.includes(traderId)

  const handleToggleWatch = () => {
    if (!userType) {
      addMessage({
        id: Math.random(),
        title: localeTool.t('error.guest'),
        type: 'error',
      })
    }
    if (isWatched) {
      deleteUserFollowed(traderId)
    } else {
      createUserFollowed(traderId)
    }
  }

  return {
    isWatched,
    handleToggleWatch,
  }
}

export default useToggleWatch
