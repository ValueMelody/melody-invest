import * as interfaces from '@shared/interfaces'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useUserState from 'states/useUserState'
import useTraderRequest from 'requests/useTraderRequest'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
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
  const { commonClasses } = useCommonStyle()

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
    <vendorTool.ui.Card
      data-testid='traderComboCard'
      className={vendorTool.classNames(cardClasses.container, {
        [cardClasses.isActive]: isActive,
        [cardClasses.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickCombo : undefined}
    >
      <vendorTool.ui.Card.Content>
        <vendorTool.ui.Card.Header
          content={(
            <div className={commonClasses.rowBetween}>
              <b>{localeTool.t('common.combo')}: {traderCombo.name}</b>
              {disabled && (
                <WatchButton isWatched onToggle={handleUnfollow} />
              )}
            </div>
          )}
        />
        <vendorTool.ui.Card.Description
          content={
            disabled ? localeTool.t('permission.limited') : parseTool.traderComboTraders(traderCombo)
          }
        />
      </vendorTool.ui.Card.Content>
    </vendorTool.ui.Card>
  )
}

export default TraderComboCard
