import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  container: {
    margin: '1rem 0.75rem 1rem 0 !important',
  },
  isActive: {
    border: `2px solid ${theme.PRIMARY_COLOR} !important`,
  },
}))

const TraderEnvCard = ({
  traderEnv,
  isActive,
  onClick,
}: {
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive: boolean;
  onClick?: (envId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClickEnv = () => {
    if (!traderEnv || !onClick) return
    onClick(traderEnv.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderEnv) return null

  return (
    <vendorTool.ui.Card
      className={vendorTool.classNames(classes.container, {
        [classes.isActive]: isActive,
      })}
      onClick={handleClickEnv}
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
          content={parseTool.traderEnvTickers(traderEnv)}
        />
      </vendorTool.ui.Card.Content>
    </vendorTool.ui.Card>
  )
}

export default TraderEnvCard
