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

const TraderEnvCard = ({
  traderEnv,
  isActive = false,
  onClick,
}: {
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive?: boolean;
  onClick?: (envId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const { getUser } = useUserState()
  const user = getUser()
  const disabled = !traderEnv || (
    !traderEnv.isSystem && !user.accessibleEnvIds.includes(traderEnv.id)
  )

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = () => {
    if (!traderEnv || !onClick) return
    onClick(traderEnv.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv) return null

  return (
    <vendorTool.ui.Card
      data-testid='traderEnvCard'
      className={vendorTool.classNames(classes.container, {
        [classes.isActive]: isActive,
        [classes.disabled]: disabled,
      })}
      onClick={!disabled ? handleClickEnv : undefined}
    >
      <vendorTool.ui.Card.Content>
        <vendorTool.ui.Card.Header
          content={(
            <div className='row-between'>
              <b>{localeTool.t('common.env')}: {traderEnv.name}</b>
              {traderEnv.isSystem && (
                <vendorTool.ui.Label title={localeTool.t('traderEnv.systemDesc')}>
                  {localeTool.t('common.system')}
                </vendorTool.ui.Label>
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
