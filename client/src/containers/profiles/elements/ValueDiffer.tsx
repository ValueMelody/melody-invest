import { useMemo } from 'react'
import { Label, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as interfaces from '@shared/interfaces'
import * as parseTool from '../../../tools/parse'

const useStyles = createUseStyles(({
  container: {
    marginRight: '2rem !important',
  },
  icon: {
    marginLeft: '0.5rem !important',
  },
}))

const ValueDiffer = ({
  currentHolding,
  previousHolding,
}: {
  currentHolding: interfaces.traderHoldingModel.Record;
  previousHolding: interfaces.traderHoldingModel.Record;
}) => {
  const classes = useStyles()

  const differ = (currentHolding.totalValue - previousHolding.totalValue) / previousHolding.totalValue

  const color = useMemo(() => {
    if (differ > 0) return 'green'
    if (differ < 0) return 'red'
    return undefined
  }, [differ])

  return (
    <Label
      className={classes.container}
      color={color}
    >
      {parseTool.floatToPercent(differ)}
      {differ && (
        <Icon className={classes.icon} name={differ > 0 ? 'level up' : 'level down'} />
      )}
    </Label>
  )
}

export default ValueDiffer
