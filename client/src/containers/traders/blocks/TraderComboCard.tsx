import classNames from 'classnames'
import { Card } from 'flowbite-react'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useUserState from 'states/useUserState'
import useTraderRequest from 'requests/useTraderRequest'
import useCardStyle from 'styles/useCardStyle'
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

  const { cardClasses } = useCardStyle()

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
      className={classNames(cardClasses.container, {
        'cursor-pointer': !disabled && !!onClick,
        [cardClasses.isActive]: isActive,
        [cardClasses.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickCombo : undefined}
    >
      <header className='flex justify-between items-center'>
        <b>{localeTool.t('common.combo')}: {traderCombo.name}</b>
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
