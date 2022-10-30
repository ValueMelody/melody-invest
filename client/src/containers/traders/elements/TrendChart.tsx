import * as interfaces from '@shared/interfaces'
import * as chart from 'recharts'

const TrendChart = ({
  data,
  title,
}: {
  data: interfaces.common.Option[];
  title?: string;
}) => {
  // ------------------------------------------------------------ UI --

  const stats = data.length
    ? data.reduce((stats, option) => {
      const min = stats.min < option.value ? stats.min : option.value
      const max = stats.max > option.value ? stats.max : option.value
      return { min, max }
    }, { min: data[0].value, max: data[0].value })
    : null

  if (data.length <= 1 || !stats) return null

  return (
    <chart.AreaChart
      data={data}
      width={280}
      height={80}
    >
      <chart.Area
        type='monotone'
        dataKey='value'
        stroke='#8884d8'
        strokeWidth={2}
        isAnimationActive={false}
      />
      <chart.YAxis
        type='number'
        domain={[stats.min, stats.max]}
        axisLine={false}
        tick={false}
        width={0}
      />

      {title && (
        <chart.XAxis
          tick={false}
          axisLine={false}
          height={20}
        >
          <chart.Label
            orientation='bottom'
            value={title}
            offset={0}
            position='insideBottomRight'
          />
        </chart.XAxis>
      )}
    </chart.AreaChart>
  )
}

export default TrendChart
