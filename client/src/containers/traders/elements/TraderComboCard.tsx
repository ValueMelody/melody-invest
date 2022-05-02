import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  container: {
    margin: '1rem 0.75rem 1rem 0 !important',
  },
  isActive: {
    border: `3px solid ${theme.PrimaryColor} !important`,
  },
}))

const TraderComboCard = ({
  traderCombo,
  isActive,
  onClick,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  isActive?: boolean;
  onClick?: (comboId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  // ------------------------------------------------------------ UI --

  if (!traderCombo) return null

  return (
    <vendorTool.ui.Card
      className={vendorTool.classNames(classes.container, {
        [classes.isActive]: !!isActive,
      })}
      onClick={handleClickCombo}
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
          content={parseTool.traderComboTraders(traderCombo)}
        />
      </vendorTool.ui.Card.Content>
    </vendorTool.ui.Card>
  )
}

export default TraderComboCard
