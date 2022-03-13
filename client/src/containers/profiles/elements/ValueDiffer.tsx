import { Label, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'

const useStyles = createUseStyles(({
  container: {
    marginRight: '2rem !important',
  },
  icon: {
    marginLeft: '0.5rem !important',
  },
}))

const ValueDiffer = ({
  currentValue,
  previousValue,
}: {
  currentValue: number;
  previousValue: number;
}) => {
  const classes = useStyles()

  const differ = (currentValue - previousValue) / previousValue
  const isPositive = differ > 0

  if (!differ) return null

  return (
    <Label
      className={classes.container}
      color={isPositive ? 'green' : 'red'}
      title={localeTool.t(isPositive ? 'profile.value.increased' : 'profile.value.decreased')}
    >
      {parseTool.floatToPercent(differ)}
      <Icon className={classes.icon} name={isPositive ? 'level up' : 'level down'} />
    </Label>
  )
}

export default ValueDiffer
