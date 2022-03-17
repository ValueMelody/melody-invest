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
}: {
  patternId: number;
}) => {
  const classes = useStyles()

  return (
    <Label color='blue' className={classes.label}>
      {localeTool.t('common.pattern')}: #{patternId}
    </Label>
  )
}

export default PatternLabel
