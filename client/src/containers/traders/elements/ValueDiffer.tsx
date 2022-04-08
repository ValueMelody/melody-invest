import { Label, Icon } from 'semantic-ui-react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as themeEnum from '../../../enums/theme'

const useStyles = createUseStyles(({
  container: {
    marginRight: '2rem !important',
  },
  label: {
    marginLeft: '0.5rem !important',
  },
  icon: {
    marginLeft: '0.5rem !important',
  },
}))

const ValueDiffer = ({
  title,
  currentValue,
  compareValue,
}: {
  title: string,
  currentValue: number;
  compareValue: number;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const differ = (currentValue - compareValue) / compareValue
  const isPositive = differ > 0

  // ------------------------------------------------------------ Interface --

  if (!differ) return null

  return (
    <div className={classNames('row-start', classes.container)}>
      <h5>{title}:</h5>
      <Label
        className={classes.label}
        color={isPositive ? themeEnum.theme.INCREASE_COLOR : themeEnum.theme.DECREASE_COLOR}
        title={localeTool.t(isPositive ? 'profile.value.increased' : 'profile.value.decreased')}
      >
        {parseTool.floatToPercent(differ)}
        <Icon className={classes.icon} name={isPositive ? 'level up' : 'level down'} />
      </Label>
    </div>
  )
}

export default ValueDiffer
