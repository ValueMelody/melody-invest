import * as vendorTool from '../../../tools/vendor'
import * as localeTool from '../../../tools/locale'

interface DataPoint {
  label: string;
  value: number;
}

const TrendChart = ({
  data,
}: {
  data: DataPoint[];
}) => {
  // ------------------------------------------------------------ Interface --

  if (!data.length) return null

  return (
    <vendorTool.chart.AreaChart width={280} height={80} data={data}>
      <vendorTool.chart.Area
        type='monotone'
        dataKey='value'
        stroke='#8884d8'
        strokeWidth={2}
        isAnimationActive={false}
      />
      <vendorTool.chart.XAxis tick={false} axisLine={false} height={20}>
        <vendorTool.chart.Label
          orientation='bottom'
          value={`${localeTool.t('profile.daysTrends', { num: 30 * data.length })}`}
          offset={0}
          position='insideBottomRight'
        />
      </vendorTool.chart.XAxis>
    </vendorTool.chart.AreaChart>
  )
}

export default TrendChart
