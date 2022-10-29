import { SyntheticEvent } from 'react'
import classNames from 'classnames'
import { Button } from 'flowbite-react'
import TrendChart from './TrendChart'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import { createUseStyles } from 'react-jss'
import useCommonStyle from 'styles/useCommonStyle'

const useStyles = createUseStyles(({
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
  // ------------------------------------------------------------ State --

  const classes = useStyles()
  const { commonClasses } = useCommonStyle()

  const hasNoTrends = !oneYearTrends?.length && !oneDecadeTrends?.length

  const decadeTrends = parseTool.chartTrends(oneDecadeTrends, totalValue)
  const yearTrends = parseTool.chartTrends(oneYearTrends, totalValue)

  // ------------------------------------------------------------ Handler --

  const handleClickDecadeChart = (e: SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(0)
  }

  const handleClickYearChart = (e: SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(1)
  }

  // ------------------------------------------------------------ UI --

  if (!totalValue || hasNoTrends) return null

  return (
    <section
      data-testid='valueChangeCharts'
      className={classNames(
        classes.root,
        commonClasses.columnCenter,
      )}
    >
      <div className={commonClasses.rowAround}>
        <TrendChart
          data={activeChartIndex === 0 ? decadeTrends : yearTrends}
        />
      </div>
      <Button.Group>
        <Button
          size='xs'
          onClick={handleClickDecadeChart}
          color={activeChartIndex === 0 ? undefined : 'gray'}
        >
          {localeTool.t('common.yearsTrends', { num: decadeTrends.length - 1 })}
        </Button>
        <Button
          size='xs'
          onClick={handleClickYearChart}
          color={activeChartIndex === 1 ? undefined : 'gray'}
        >
          {localeTool.t('common.daysTrends', { num: 30 * (yearTrends.length - 1) })}
        </Button>
      </Button.Group>
    </section>
  )
}

export default ValueChangeCharts
