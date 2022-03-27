import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { Card } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import * as themeEnum from '../../../enums/theme'
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
  traderEnv: interfaces.traderEnvModel.Record;
  isActive: boolean;
  onClick?: (envId: number) => void;
}) => {
  const classes = useStyles()

  const handleClickEnv = () => {
    if (!onClick) return
    onClick(traderEnv.id)
  }

  return (
    <Card
      key={traderEnv.id}
      className={classNames(classes.container, {
        [classes.isActive]: isActive,
      })}
      header={parseTool.traderEnvName(traderEnv)}
      meta={parseTool.traderEnvStartDate(traderEnv)}
      description={parseTool.traderEnvTickers(traderEnv)}
      onClick={handleClickEnv}
    />
  )
}

export default TraderEnvCard
