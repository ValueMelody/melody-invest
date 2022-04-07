import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Card } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
  container: {
    margin: '1rem 0.75rem 1rem 0 !important',
  },
  isActive: {
    border: `2px solid ${theme.PRIMARY_COLOR} !important`,
  },
}))

const TraderComboCard = ({
  traderCombo,
  traderEnv,
  isActive,
  onClick,
}: {
  traderCombo: interfaces.traderComboModel.Identity | null;
  traderEnv: interfaces.traderEnvModel.Record | null;
  isActive: boolean;
  onClick?: (comboId: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleClickCombo = () => {
    if (!traderCombo || !onClick) return
    onClick(traderCombo.id)
  }

  // ------------------------------------------------------------ Interface --

  if (!traderCombo || !traderEnv) return null

  return (
    <Card
      className={classNames(classes.container, {
        [classes.isActive]: isActive,
      })}
      onClick={handleClickCombo}
    >
      <Card.Content>
        <Card.Header
          content={(
            <div className='row-between'>
              {traderCombo.name}
            </div>
          )}
        />
        <Card.Description content={traderEnv.name} />
      </Card.Content>
    </Card>
  )
}

export default TraderComboCard
