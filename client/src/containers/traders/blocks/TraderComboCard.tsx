import classNames from 'classnames'
import { Card } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useUserState from 'states/useUserState'
import useTraderRequest from 'requests/useTraderRequest'
import WatchButton from '../elements/WatchButton'

const TraderComboCard = ({
  traderCombo,
  onClick,
  isActive = false,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  isActive?: boolean;
  onClick?: (comboId: number) => void;
}) => {
  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()

  const { deleteTraderCombo } = useTraderRequest()

  const disabled = traderCombo && (
    !traderCombo.isSystem && !user.accessibleComboIds.includes(traderCombo.id)
  )

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  const handleUnfollow = async () => {
    if (!traderCombo) return
    await deleteTraderCombo(traderCombo.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderCombo) return null

  return (
    <Card
      data-testid='traderComboCard'
      className={classNames(
        '[&>div]:p-2 [&>div]:gap-2',
        {
          'cursor-pointer': !disabled && !!onClick,
          'card-active': isActive,
          'card-disabled': disabled,
        },
      )}
      onClick={!disabled ? handleClickCombo : undefined}
    >
      <header className='flex justify-between items-center'>
        <h3 className='font-bold'>
          {localeTool.t('common.combo')}: {traderCombo.name}
        </h3>
        {disabled && (
          <WatchButton isWatched onToggle={handleUnfollow} />
        )}
      </header>
      <h5>
        {disabled ? localeTool.t('permission.limited') : parseTool.traderComboTraders(traderCombo)}
      </h5>
    </Card>
  )
}

export default TraderComboCard
