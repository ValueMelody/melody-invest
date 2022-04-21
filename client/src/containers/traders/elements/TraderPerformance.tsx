import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'
import * as parseTool from '../../../tools/parse'
import * as themeEnum from '../../../enums/theme'

const useStyles = vendorTool.jss.createUseStyles((
  theme: themeEnum.Theme,
) => ({
  gainCell: {
    padding: '0.5rem !important',
  },
  focusCell: {
    border: `1px solid ${theme.PrimaryColor}`,
  },
}))

const FOCUS_TYPE = {
  YEARLY: 'YEARLY',
  PAST_YEAR: 'PAST_YEAR',
  PAST_QUARTER: 'PAST_QUARTER',
  PAST_MONTH: 'PAST_MONTH',
  PAST_WEEK: 'PAST_WEEK',
}
type FocusTypeKeys = keyof typeof FOCUS_TYPE
export type FocusType = typeof FOCUS_TYPE[FocusTypeKeys]

const TraderPerformance = ({
  trader,
  focusType,
}: {
  trader: interfaces.traderModel.Record;
  focusType?: FocusType;
}) => {
  const classes = useStyles()
  const gainCellClass = vendorTool.classNames('column-center', classes.gainCell)

  // ------------------------------------------------------------ UI --

  if (!trader.estimatedAt) {
    return (
      <vendorTool.ui.Message compact>
        {localeTool.t('profile.noResultYet')}
      </vendorTool.ui.Message>
    )
  }

  return (
    <vendorTool.ui.Menu compact>
      <vendorTool.ui.Menu.Item
        className={vendorTool.classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.YEARLY,
        })}
      >
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.yearly')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(trader.yearlyPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item
        className={vendorTool.classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_YEAR,
        })}
      >
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastYear')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(trader.pastYearPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item
        className={vendorTool.classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_QUARTER,
        })}
      >
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastQuarter')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(trader.pastQuarterPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item
        className={vendorTool.classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_MONTH,
        })}
      >
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastMonth')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(trader.pastMonthPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item
        className={vendorTool.classNames(gainCellClass, {
          [classes.focusCell]: focusType === FOCUS_TYPE.PAST_WEEK,
        })}
      >
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastWeek')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(trader.pastWeekPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
    </vendorTool.ui.Menu>
  )
}

export default TraderPerformance
