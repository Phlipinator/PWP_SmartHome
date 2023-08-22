import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface HistoryChartDataPoint {
  x: string
  yVal: number
}

interface HistoryChartProps {
  data: HistoryChartDataPoint[]
  xLabel: string
  yLabel: string
  colorHex?: string
}

const HistoryChart: React.FC<HistoryChartProps> = (props) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={props.data} margin={{ top: 0, right: 0, left: 12, bottom: 20 }}>
        <XAxis
          dataKey='x'
          stroke='white'
          label={{ value: props.xLabel, position: 'bottom', fill: 'white' }}
        />
        <YAxis
          width={36}
          stroke='white'
          label={{
            value: props.yLabel,
            angle: -90,
            position: 'left',
            fill: 'white',
            style: { textAnchor: 'middle' },
          }}
        />
        <Area
          type='monotone'
          dataKey='yVal'
          stroke={props.colorHex ? props.colorHex : '#c68e3e'}
          fill={props.colorHex ? props.colorHex : '#c68e3e'}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export { HistoryChart }
