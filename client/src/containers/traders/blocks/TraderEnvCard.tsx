import * as interfaces from '@shared/interfaces'
import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useUserState from 'states/useUserState'
import useTraderRequest from 'requests/useTraderRequest'
import useCardStyle from 'styles/useCardStyle'
import useCommonStyle from 'styles/useCommonStyle'
import WatchButton from '../elements/WatchButton'

const TraderEnvCard = ({
  traderEnv,
  isActive = false,
  onClick,
}: {
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive?: boolean;
  onClick?: (envId: number) => void;
}) => {
  // ------------------------------------------------------------ State --

  const { cardClasses } = useCardStyle()
  const { commonClasses } = useCommonStyle()

  const { getUser } = useUserState()
  const user = getUser()

  const { deleteTraderEnv } = useTraderRequest()

  const disabled = traderEnv && (
    !traderEnv.isSystem && !user.accessibleEnvIds.includes(traderEnv.id)
  )

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = () => {
    if (!traderEnv || !onClick) return
    onClick(traderEnv.id)
  }

  const handleUnfollow = async () => {
    if (!traderEnv) return
    await deleteTraderEnv(traderEnv.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv) return null

  return (
    <vendorTool.ui.Card
      data-testid='traderEnvCard'
      className={vendorTool.classNames(cardClasses.container, {
        [cardClasses.isActive]: isActive,
        [cardClasses.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickEnv : undefined}
    >
      <vendorTool.ui.Card.Content>
        <vendorTool.ui.Card.Header
          content={(
            <div className={commonClasses.rowBetween}>
              <b>{localeTool.t('common.env')}: {traderEnv.name}</b>
              {traderEnv.isSystem && (
                <vendorTool.ui.Label title={localeTool.t('traderEnv.systemDesc')}>
                  {localeTool.t('common.system')}
                </vendorTool.ui.Label>
              )}
              {disabled && (
                <WatchButton isWatched onToggle={handleUnfollow} />
              )}
            </div>
          )}
        />
        <vendorTool.ui.Card.Meta
          content={parseTool.traderEnvStartDate(traderEnv)}
        />
        <vendorTool.ui.Card.Description
          content={
            disabled ? localeTool.t('permission.limited') : parseTool.traderEnvTickers(traderEnv)
          }
        />
      </vendorTool.ui.Card.Content>
    </vendorTool.ui.Card>
  )
}

export default TraderEnvCard