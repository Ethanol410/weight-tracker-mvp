'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { DailyEntry } from '@/types'
import { formatDate } from '@/lib/utils'

interface MetricsChartProps {
  entries: DailyEntry[]
  height?: number
  chartType?: 'line' | 'bar'
}

interface ChartDataPoint {
  date: string
  fatigueLevel: number
  caloriesConsumed: number
  steps: number
  formattedDate: string
}

export default function MetricsChart({ entries, height = 400, chartType = 'line' }: MetricsChartProps) {
  // Préparer les données pour le graphique
  const chartData: ChartDataPoint[] = entries
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toISOString().split('T')[0],
      fatigueLevel: entry.fatigueLevel,
      caloriesConsumed: entry.caloriesConsumed,
      steps: entry.steps,
      formattedDate: formatDate(new Date(entry.date))
    }))  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data.formattedDate}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}: </span>
              {entry.dataKey === 'fatigueLevel' ? `${entry.value}/10` :
               entry.dataKey === 'caloriesConsumed' ? `${entry.value} kcal` :
               entry.dataKey === 'steps' ? `${entry.value.toLocaleString()} pas` :
               entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques quotidiennes</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Aucune donnée à afficher. Ajoutez des entrées pour voir vos métriques.</p>
        </div>
      </div>
    )
  }

  // Calculer les moyennes
  const avgFatigue = entries.reduce((sum, e) => sum + e.fatigueLevel, 0) / entries.length
  const avgCalories = entries.reduce((sum, e) => sum + e.caloriesConsumed, 0) / entries.length
  const avgSteps = entries.reduce((sum, e) => sum + e.steps, 0) / entries.length

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Métriques quotidiennes</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="block">Fatigue moyenne</span>
            <strong className="text-orange-600">{avgFatigue.toFixed(1)}/10</strong>
          </div>
          <div>
            <span className="block">Calories moyennes</span>
            <strong className="text-green-600">{avgCalories.toFixed(0)} kcal</strong>
          </div>
          <div>
            <span className="block">Pas moyens</span>
            <strong className="text-purple-600">{avgSteps.toFixed(0)} pas</strong>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {chartType === 'line' ? (
            <>
              <Line 
                type="monotone" 
                dataKey="fatigueLevel" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                name="Niveau de fatigue"
                yAxisId="left"
              />
              <Line 
                type="monotone" 
                dataKey="caloriesConsumed" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                name="Calories consommées"
                yAxisId="right"
              />
              <Line 
                type="monotone" 
                dataKey="steps" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }}
                name="Nombre de pas"
                yAxisId="right"
              />
            </>
          ) : (
            <>
              <Bar dataKey="fatigueLevel" fill="#f97316" name="Niveau de fatigue" />
              <Bar dataKey="caloriesConsumed" fill="#22c55e" name="Calories consommées" />
              <Bar dataKey="steps" fill="#a855f7" name="Nombre de pas" />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
