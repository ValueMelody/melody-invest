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

  const titleLocaleKey = `behaviorTitle.${type}`
  const descLocaleKey = `behaviorDesc.${type}`

  return (
    <Label className={classes.container} title={localeTool.t(descLocaleKey)}>
      {localeTool.t(titleLocaleKey)}
    </Label>
  )
}

export default BehaviorEditor
