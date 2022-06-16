import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import useUserState from '../../../states/useUserState'

const useStyles = vendorTool.jss.createUseStyles((
  theme: interfaces.common.Theme,
) => ({
  container: {
    margin: '1rem 0.75rem 1rem 0 !important',
  },
  isActive: {
    border: `3px solid ${theme.PrimaryColor} !important`,
  },
  disabled: {
    backgroundColor: `${theme.LightGray} !important`,
  },
}))

const TraderComboCard = ({
  traderCombo,
  onClick,
  isActive = false,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  isActive?: boolean;
  onClick?: (comboId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()
  const disabled = !traderCombo || (
    !traderCombo.isSystem && !user.accessibleComboIds.includes(traderCombo.id)
  )

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderCombo) return null

  return (
    <vendorTool.ui.Card
      data-testid='traderComboCard'
      className={vendorTool.classNames(classes.container, {
        [classes.isActive]: isActive,
        [classes.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickCombo : undefined}
    >
      <vendorTool.ui.Card.Content>
        <vendorTool.ui.Card.Header
          content={(
            <div className='row-between'>
              <b>{localeTool.t('common.combo')}: {traderCombo.name}</b>
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
