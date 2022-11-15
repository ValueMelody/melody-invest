import * as chart from 'recharts'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { MouseEvent } from 'react'

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
      <text
        y={cy - 25}
        textAnchor='middle'
        fontSize={12}
        fill={fill}
      >
        <tspan
          x={cx}
          dy={15}
        >
          {payload.label}
        </tspan>
        <tspan
          x={cx}
          dy={15}
        >
          {payload.desc}
        </tspan>
        <tspan
          x={cx}
          dy={15}
        >
          {weight}
        </tspan>
      </text>
      <chart.Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <chart.Sector
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
    e: MouseEvent,
    index: number,
  ) => {
    onMouseEnter(index)
  }

  // ------------------------------------------------------------ UI --

  if (!data.length) return null

  return (
    <chart.PieChart
      width={200}
      height={200}
    >
      <chart.Pie
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
        isAnimationActive={false}
        fill='#2185d0'
      >
        {data.map((entry, index) => (
          <chart.Cell
            key={entry.value}
            fill={
              index === activeIndex ? '#2185d0' : '#767676'
            }
          />
        ))}
      </chart.Pie>
    </chart.PieChart>
  )
}

export default WeightChart
