import * as vendorTool from '../../../tools/vendor'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'
import * as themeEnum from '../../../enums/theme'

interface DataPoint {
  label: string;
  desc: string;
  value: number;
}

const ActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DataPoint;
  percent: number;
  value: number;
}) => {
  // ------------------------------------------------------------ State --

  const weight = payload.value
    ? `${localeTool.t('common.weight')}: ${parseTool.floatToPercent(percent)}`
    : ''

  // ------------------------------------------------------------ UI --

  return (
    <g>
      <text y={cy - 25} textAnchor='middle' fontSize={12} fill={fill}>
        <tspan x={cx} dy={15}>
          {payload.label}
        </tspan>
        <tspan x={cx} dy={15}>
          {payload.desc}
        </tspan>
        <tspan x={cx} dy={15}>
          {weight}
        </tspan>
      </text>
      <vendorTool.chart.Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <vendorTool.chart.Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

const WeightChart = ({
  data,
  activeIndex,
  onMouseEnter,
}: {
  data: DataPoint[];
  activeIndex: number;
  onMouseEnter: (index: number) => void;
}) => {
  // ------------------------------------------------------------ Handler --

  const handleMouseEnter = (
    e: vendorTool.react.MouseEvent,
    index: number,
  ) => {
    onMouseEnter(index)
  }

  // ------------------------------------------------------------ UI --

  if (!data.length) return null

  return (
    <vendorTool.chart.PieChart width={200} height={200}>
      <vendorTool.chart.Pie
        onMouseEnter={handleMouseEnter}
        activeIndex={activeIndex}
        activeShape={ActiveShape}
        dataKey='value'
        nameKey='label'
        cx='50%'
        cy='50%'
        data={data}
        innerRadius={60}
        outerRadius={80}
        fill={themeEnum.Basic.PrimaryColor}
        isAnimationActive={false}
      >
        {data.map((entry, index) => (
          <vendorTool.chart.Cell
            key={entry.value}
            fill={
              index === activeIndex ? themeEnum.Basic.PrimaryColor : themeEnum.Basic.SecondaryColor
            }
          />
        ))}
      </vendorTool.chart.Pie>
    </vendorTool.chart.PieChart>
  )
}

export default WeightChart
