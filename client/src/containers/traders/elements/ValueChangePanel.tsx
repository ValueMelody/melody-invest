import classNames from 'classnames'
import ValueChangeCharts from './ValueChangeCharts'
import ValueChangePercents from './ValueChangePercents'

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
  className,
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
  showPercents?: boolean;
  showCharts?: boolean;
  className?: string;
}) => {
  const handleChangeChartIndex = (index: number) => {
    onChangeChart(index)
  }

  if (!showPercents && !showCharts) return null

  return (
    <section className={classNames('flex flex-wrap items-center justify-around', className)}>
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
