import TrendChart from './TrendChart'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as vendorTool from '../../../tools/vendor'

const useStyles = vendorTool.jss.createUseStyles(({
  root: {
    margin: '1rem 0',
  },
}))

const ValueChangeCharts = ({
  oneDecadeTrends,
  oneYearTrends,
  totalValue,
  activeChartIndex,
  onChangeChart,
}: {
  oneDecadeTrends: number[] | null;
  oneYearTrends: number[] | null;
  totalValue: number | null;
  activeChartIndex: number;
  onChangeChart: (index: number) => void;
}) => {
  const classes = useStyles()

  // ------------------------------------------------------------ State --

  const hasNoTrends = !oneYearTrends?.length && !oneDecadeTrends?.length

  const decadeTrends = parseTool.chartTrends(oneDecadeTrends, totalValue)
  const yearTrends = parseTool.chartTrends(oneYearTrends, totalValue)

  // ------------------------------------------------------------ Handler --

  const handleClickDecadeChart = (e: vendorTool.react.SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(0)
  }

  const handleClickYearChart = (e: vendorTool.react.SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(1)
  }

  // ------------------------------------------------------------ UI --

  if (!totalValue || hasNoTrends) return null

  return (
    <section className={vendorTool.classNames(classes.root, 'column-center')}>
      <div className='row-around'>
        <TrendChart
          data={activeChartIndex === 0 ? decadeTrends : yearTrends}
        />
      </div>
      <vendorTool.ui.Button.Group compact>
        <vendorTool.ui.Button
          onClick={handleClickDecadeChart}
          color={activeChartIndex === 0 ? 'blue' : undefined}
        >
          {localeTool.t('common.yearsTrends', { num: decadeTrends.length - 1 })}
        </vendorTool.ui.Button>
        <vendorTool.ui.Button
          onClick={handleClickYearChart}
          color={activeChartIndex === 1 ? 'blue' : undefined}
        >
          {localeTool.t('common.daysTrends', { num: 30 * (yearTrends.length - 1) })}
        </vendorTool.ui.Button>
      </vendorTool.ui.Button.Group>
    </section>
  )
}

export default ValueChangeCharts
