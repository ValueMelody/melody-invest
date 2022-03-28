import useUserState from '../../../states/useUserState'
import useCommonState from '../../../states/useCommonState'
import * as localeTool from '../../../tools/locale'

const useWatchInterface = ({
  traderId,
}: {
  traderId: number;
}) => {
  const { userType, userTraderIds, createUserFollowed, deleteUserFollowed } = useUserState()
  const { addMessage } = useCommonState()

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

export default useWatchInterface
