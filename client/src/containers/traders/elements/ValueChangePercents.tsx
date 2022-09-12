import * as vendorTool from 'tools/vendor'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = vendorTool.jss.createUseStyles(({
  gainCell: {
    padding: '0.5rem !important',
  },
}))

const ValueChangePercents = ({
  yearlyPercentNumber,
  pastYearPercentNumber,
  pastQuarterPercentNumber,
  pastMonthPercentNumber,
  pastWeekPercentNumber,
}: {
  yearlyPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
}) => {
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const gainCellClass = vendorTool.classNames(commonClasses.columnCenter, classes.gainCell)

  const hasValue =
    yearlyPercentNumber ||
    pastYearPercentNumber ||
    pastQuarterPercentNumber ||
    pastMonthPercentNumber ||
    pastWeekPercentNumber

  // ------------------------------------------------------------ UI --

  if (!hasValue) {
    return (
      <vendorTool.ui.Message compact>
        {localeTool.t('common.noResultYet')}
      </vendorTool.ui.Message>
    )
  }

  return (
    <vendorTool.ui.Menu compact data-testid='valueChangePercents'>
      <vendorTool.ui.Menu.Item className={gainCellClass}>
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.yearly')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(yearlyPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item className={gainCellClass}>
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastYear')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(pastYearPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item className={gainCellClass}>
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastQuarter')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(pastQuarterPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item className={gainCellClass}>
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastMonth')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(pastMonthPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
      <vendorTool.ui.Menu.Item className={gainCellClass}>
        <vendorTool.ui.Header as='h6'>
          {localeTool.t('gain.pastWeek')}:
        </vendorTool.ui.Header>
        <vendorTool.ui.Header as='h5'>
          {parseTool.dbPercentNumber(pastWeekPercentNumber)}
        </vendorTool.ui.Header>
      </vendorTool.ui.Menu.Item>
    </vendorTool.ui.Menu>
  )
}

export default ValueChangePercents
