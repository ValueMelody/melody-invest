import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'flowbite-react'
import WatchButton from '../elements/WatchButton'
import classNames from 'classnames'

const TraderComboCard = ({
  traderCombo,
  className,
  onClick,
  isActive = false,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  className?: string;
  isActive?: boolean;
  onClick?: (comboId: number) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector(selectors.selectUser())

  const disabled = traderCombo && (
    !traderCombo.isSystem && !user.access.accessibleComboIds.includes(traderCombo.id)
  )

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  const handleUnfollow = async () => {
    if (!traderCombo) return
    dispatch(actions.deleteTraderCombo(traderCombo.id))
  }

  if (!traderCombo) return null

  return (
    <Card
      data-testid='traderComboCard'
      className={classNames(
        className,
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
        <h3
          className='font-bold'
          data-testid='traderComboCardName'
        >
          {localeTool.t('common.combo')}: {parseTool.traderComboName(traderCombo)}
        </h3>
        {disabled && (
          <WatchButton
            isWatched
            onToggle={handleUnfollow}
          />
        )}
      </header>
      <h5>
        {disabled ? localeTool.t('permission.limited') : parseTool.traderComboTraders(traderCombo)}
      </h5>
    </Card>
  )
}

export default TraderComboCard
