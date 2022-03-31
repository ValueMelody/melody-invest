import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Card, Label } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'

const useStyles = createUseStyles((theme: themeEnum.Theme) => ({
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

  // ------------------------------------------------------------ Interface --

  if (!traderEnv) return null

  return (
    <Card
      key={traderEnv.id}
      className={classNames(classes.container, {
        [classes.isActive]: isActive,
      })}
      onClick={handleClickEnv}
    >
      <Card.Content>
        <Card.Header
          content={(
            <div className='row-between'>
              {parseTool.traderEnvName(traderEnv)}
              {traderEnv.isSystem && (
                <Label title={localeTool.t('traderEnv.systemDesc')}>
                  {localeTool.t('common.system')}
                </Label>
              )}
            </div>
          )}
        />
        <Card.Meta content={parseTool.traderEnvStartDate(traderEnv)} />
        <Card.Description content={parseTool.traderEnvTickers(traderEnv)} />
      </Card.Content>
    </Card>
  )
}

export default TraderEnvCard
