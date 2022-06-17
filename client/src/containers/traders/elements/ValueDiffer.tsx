import * as vendorTool from 'tools/vendor'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import * as themeEnum from 'enums/theme'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = vendorTool.jss.createUseStyles(({
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
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const differ = (currentValue - compareValue) / compareValue
  const isPositive = differ > 0

  // ------------------------------------------------------------ UI --

  if (!differ) return null

  return (
    <div
      data-testid='valueDiffer'
      className={vendorTool.classNames(
        commonClasses.rowStart,
        classes.container,
      )}
    >
      {title && <h5>{title}:</h5>}
      <vendorTool.ui.Label
        className={classes.label}
        color={isPositive ? themeEnum.theme.IncreaseColor : themeEnum.theme.DecreaseColor}
        title={localeTool.t(isPositive ? 'profile.value.increased' : 'profile.value.decreased')}
      >
        {parseTool.floatToPercent(differ)}
        <vendorTool.ui.Icon
          className={classes.icon}
          name={isPositive ? 'level up' : 'level down'}
        />
      </vendorTool.ui.Label>
    </div>
  )
}

export default ValueDiffer
