'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DailyEntry } from '@/types'
import { formatDate } from '@/lib/utils'

interface IndividualMetricChartProps {
  entries: DailyEntry[]
  height?: number
  chartType?: 'line' | 'bar'
  metric: 'fatigueLevel' | 'caloriesConsumed' | 'steps' | 'weight'
  title: string
  color: string
  unit: string
  yAxisDomain?: [number, number]
}

interface ChartDataPoint {
  date: string
  value: number
  formattedDate: string
}

export default function IndividualMetricChart({ 
  entries, 
  height = 300, 
  chartType = 'line',
  metric,
  title,
  color,
  unit,
  yAxisDomain
}: IndividualMetricChartProps) {
  
  // Préparer les données pour le graphique
  const chartData: ChartDataPoint[] = entries
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toISOString().split('T')[0],
      value: entry[metric],
      formattedDate: formatDate(new Date(entry.date))
    }))

  // Calculer les statistiques
  const values = entries.map(e => e[metric])
  const average = values.reduce((sum, v) => sum + v, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart
  // Composant de tooltip personnalisé
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = chartData.find(d => d.date === label)
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data?.formattedDate}</p>
          <p style={{ color }}>
            <span className="font-medium">{title}: </span>
            {payload[0].value}{unit}
          </p>
        </div>
      )
    }
    return null
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          {title}
        </h4>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* En-tête avec statistiques */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
          {title}
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Moyenne</div>
            <div className="font-semibold" style={{ color }}>{average.toFixed(1)}{unit}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Minimum</div>
            <div className="font-semibold text-gray-700">{min}{unit}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500">Maximum</div>
            <div className="font-semibold text-gray-700">{max}{unit}</div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getDate()}/${date.getMonth() + 1}`
            }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={yAxisDomain || ['auto', 'auto']}
            tickFormatter={(value) => {
              if (metric === 'steps') {
                return `${(value / 1000).toFixed(0)}k`
              }
              return value.toString()
            }}
          />
          <Tooltip content={<CustomTooltip />} />

          {chartType === 'line' ? (
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              name={title}
            />
          ) : (
            <Bar dataKey="value" fill={color} name={title} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
