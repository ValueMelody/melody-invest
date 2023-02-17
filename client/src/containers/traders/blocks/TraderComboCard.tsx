import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import * as routerTool from 'tools/router'
import * as selectors from 'selectors'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'flowbite-react'
import WatchButton from '../elements/WatchButton'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

const TraderComboCard = ({
  traderCombo,
  className,
  onClick,
  isActive = false,
  allowUnwatch = false,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  className?: string;
  isActive?: boolean;
  onClick?: (comboId: number) => void;
  allowUnwatch?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const user = useSelector(selectors.selectUser())

  const disabled = traderCombo && (
    !traderCombo.isSystem && !user.access.accessibleComboIds.includes(traderCombo.id)
  )

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  const handleUnfollow = async () => {
    dispatch(actions.deleteTraderCombo(traderCombo!.id))
      .then((res: any) => {
        if (!res.error) navigate(routerTool.dashboardRoute())
      })
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
        {(allowUnwatch || disabled) && (
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
