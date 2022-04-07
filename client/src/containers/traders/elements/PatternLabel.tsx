import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles(({
  label: {
    alignSelf: 'flex-start',
  },
}))

const PatternLabel = ({
  patternId,
  traderEnv,
}: {
  patternId: number;
  traderEnv: interfaces.traderEnvModel.Record;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Interface --

  return (
    <Label color='blue' className={classes.label}>
      {localeTool.t('common.pattern')} #{patternId} - {traderEnv.name}
    </Label>
  )
}

export default PatternLabel
