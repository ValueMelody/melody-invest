import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { Button } from 'flowbite-react'
import { SyntheticEvent } from 'react'
import TrendChart from './TrendChart'

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
  const hasNoTrends = !oneYearTrends?.length && !oneDecadeTrends?.length

  const decadeTrends = parseTool.chartTrends(oneDecadeTrends, totalValue)
  const yearTrends = parseTool.chartTrends(oneYearTrends, totalValue)
  const isDecadeChart = activeChartIndex === 0

  const handleClickDecadeChart = (e: SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(0)
  }

  const handleClickYearChart = (e: SyntheticEvent) => {
    e.stopPropagation()
    onChangeChart(1)
  }

  if (!totalValue || hasNoTrends) return null

  return (
    <section
      data-testid='valueChangeCharts'
      className='flex flex-col items-center'
    >
      <TrendChart
        data-testid={isDecadeChart ? 'decadeChart' : 'yearChart'}
        data={isDecadeChart ? decadeTrends : yearTrends}
      />
      <section className='flex items-center flex-wrap'>
        <h3 className='mr-4'>{localeTool.t('valueChange.trends')}</h3>
        <Button.Group>
          <Button
            size='xs'
            data-testid='decadeChartBtn'
            onClick={handleClickDecadeChart}
            color={isDecadeChart ? undefined : 'gray'}
          >
            {
              decadeTrends.length < 1
                ? localeTool.t('valueChange.emptyYears')
                : localeTool.t('valueChange.yearsTrends', { num: decadeTrends.length - 1 })
            }
          </Button>
          <Button
            size='xs'
            data-testid='yearChartBtn'
            onClick={handleClickYearChart}
            color={!isDecadeChart ? undefined : 'gray'}
          >
            {localeTool.t('valueChange.daysTrends', { num: 30 * (yearTrends.length - 1) })}
          </Button>
        </Button.Group>
      </section>
    </section>
  )
}

export default ValueChangeCharts
