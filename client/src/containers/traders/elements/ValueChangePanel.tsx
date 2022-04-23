import * as vendorTool from '../../../tools/vendor'
import ValueChangePercents from './ValueChangePercents'
import ValueChangeCharts from './ValueChangeCharts'

const useStyles = vendorTool.jss.createUseStyles(({
  root: {
    width: '100%',
  },
}))

const ValueChangePanel = ({
  yearlyPercentNumber,
  pastYearPercentNumber,
  pastQuarterPercentNumber,
  pastMonthPercentNumber,
  pastWeekPercentNumber,
  oneDecadeTrends,
  oneYearTrends,
  totalValue,
  activeChartIndex,
  onChangeChart,
  showPercents,
  showCharts,
}: {
  yearlyPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
  oneDecadeTrends: number[] | null;
  oneYearTrends: number[] | null;
  totalValue: number | null;
  activeChartIndex: number;
  onChangeChart: (index: number) => void;
  showPercents: boolean;
  showCharts: boolean;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ Handler --

  const handleChangeChartIndex = (index: number) => {
    onChangeChart(index)
  }

  // ------------------------------------------------------------ UI --

  if (!showPercents && !showCharts) return null

  return (
    <section className={vendorTool.classNames('row-around', classes.root)}>
      {showPercents && (
        <ValueChangePercents
          yearlyPercentNumber={yearlyPercentNumber}
          pastYearPercentNumber={pastYearPercentNumber}
          pastQuarterPercentNumber={pastQuarterPercentNumber}
          pastMonthPercentNumber={pastMonthPercentNumber}
          pastWeekPercentNumber={pastWeekPercentNumber}
        />
      )}
      {showCharts && (
        <ValueChangeCharts
          oneDecadeTrends={oneDecadeTrends}
          oneYearTrends={oneYearTrends}
          totalValue={totalValue}
          activeChartIndex={activeChartIndex}
          onChangeChart={handleChangeChartIndex}
        />
      )}
    </section>
  )
}

export default ValueChangePanel
