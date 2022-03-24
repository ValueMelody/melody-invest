import { Label } from 'semantic-ui-react'
import * as interfaces from '@shared/interfaces'
import { createUseStyles } from 'react-jss'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles({
  container: {
    margin: '0.5rem !important',
  },
})

const BehaviorEditor = ({
  type,
}: {
  type: interfaces.traderPatternModel.BehaviorType;
}) => {
  const classes = useStyles()

  const localeKey = `behavior.${type}`

  return (
    <Label className={classes.container} title={localeTool.t(localeKey)}>
      {type}
    </Label>
  )
}

export default BehaviorEditor
