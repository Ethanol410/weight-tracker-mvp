'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DailyEntry } from '@/types'
import { formatDate } from '@/lib/utils'

interface WeightChartProps {
  entries: DailyEntry[]
  height?: number
}

interface ChartDataPoint {
  date: string
  weight: number
  formattedDate: string
}

export default function WeightChart({ entries, height = 400 }: WeightChartProps) {
  // Préparer les données pour le graphique
  const chartData: ChartDataPoint[] = entries
    .slice() // Créer une copie pour ne pas modifier l'original
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Trier par date
    .map(entry => ({
      date: new Date(entry.date).toISOString().split('T')[0], // Format YYYY-MM-DD
      weight: entry.weight,
      formattedDate: formatDate(new Date(entry.date))
    }))

  // Calculer les statistiques
  const weights = entries.map(e => e.weight)
  const minWeight = Math.min(...weights)
  const maxWeight = Math.max(...weights)
  const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.formattedDate}</p>
          <p className="text-blue-600">
            <span className="font-medium">Poids: </span>
            {payload[0].value.toFixed(1)} kg
          </p>
        </div>
      )
    }
    return null
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution du poids</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Aucune donnée à afficher. Ajoutez des entrées pour voir votre évolution.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Évolution du poids</h3>
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Minimum: <strong className="text-green-600">{minWeight.toFixed(1)} kg</strong></span>
          <span>Maximum: <strong className="text-red-600">{maxWeight.toFixed(1)} kg</strong></span>
          <span>Moyenne: <strong className="text-blue-600">{avgWeight.toFixed(1)} kg</strong></span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
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
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => `${value.toFixed(1)}kg`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Poids (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
