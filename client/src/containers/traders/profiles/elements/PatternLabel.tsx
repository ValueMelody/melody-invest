import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as localeTool from '../../../../tools/locale'
import * as parseTool from '../../../../tools/parse'

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

  const envNameLocale = parseTool.traderEnvName(traderEnv)
  const envLabel = envNameLocale ? `- ${envNameLocale}` : ''

  return (
    <Label color='blue' className={classes.label}>
      {localeTool.t('common.pattern')} #{patternId} {envLabel}
    </Label>
  )
}

export default PatternLabel
