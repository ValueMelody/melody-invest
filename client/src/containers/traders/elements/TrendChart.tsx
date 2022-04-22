import * as interfaces from '@shared/interfaces'
import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'

const TrendChart = ({
  data,
}: {
  data: interfaces.common.Option[];
}) => {
  // ------------------------------------------------------------ UI --

  const stats = data.length
    ? data.reduce((stats, option) => {
      const min = stats.min < option.value ? stats.min : option.value
      const max = stats.max > option.value ? stats.max : option.value
      return { min, max }
    }, { min: data[0].value, max: data[0].value })
    : null

  if (!data.length || !stats) return null

  return (
    <vendorTool.chart.AreaChart
      data={data}
      width={280}
      height={80}
    >
      <vendorTool.chart.Area
        type='monotone'
        dataKey='value'
        stroke='#8884d8'
        strokeWidth={2}
        isAnimationActive={false}
      />
      <vendorTool.chart.YAxis
        type='number'
        domain={[stats.min, stats.max]}
        axisLine={false}
        tick={false}
        width={0}
      />

      <vendorTool.chart.XAxis tick={false} axisLine={false} height={20}>
        <vendorTool.chart.Label
          orientation='bottom'
          value={`${localeTool.t('profile.daysTrends', { num: 30 * (data.length - 1) })}`}
          offset={0}
          position='insideBottomRight'
        />
      </vendorTool.chart.XAxis>
    </vendorTool.chart.AreaChart>
  )
}

export default TrendChart
