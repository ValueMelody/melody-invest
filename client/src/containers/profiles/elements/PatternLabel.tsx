import { Label } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles(({
  label: {
    alignSelf: 'flex-start',
  },
}))

const PatternLabel = ({
  patternId,
  envName,
}: {
  patternId: number;
  envName: string | null;
}) => {
  const classes = useStyles()

  const envNameLocaleKey = `traderEnvName.${envName}`
  const envLabel = envName ? `- ${localeTool.t(envNameLocaleKey)}` : ''

  return (
    <Label color='blue' className={classes.label}>
      {localeTool.t('common.pattern')} #{patternId} {envLabel}
    </Label>
  )
}

export default PatternLabel
