'use client'

import { DailyEntry } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple'
}

export default function SummaryCard({ 
  title, 
  value, 
  trend, 
  subtitle, 
  icon,
  color = 'blue' 
}: SummaryCardProps) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    red: 'border-red-200 bg-red-50',
    orange: 'border-orange-200 bg-orange-50',
    purple: 'border-purple-200 bg-purple-50'
  }

  const textColorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    orange: 'text-orange-700',
    purple: 'text-purple-700'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    if (trend === 'neutral') return <Minus className="h-4 w-4 text-gray-600" />
    return null
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-2 ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {icon && <div className={textColorClasses[color]}>{icon}</div>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {getTrendIcon()}
          </div>
          <p className={`text-2xl font-bold ${textColorClasses[color]}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate trends and stats from entries
export function calculateStats(entries: DailyEntry[]) {
  if (entries.length === 0) return null
  const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const latest = sortedEntries[sortedEntries.length - 1]
  const previous = sortedEntries[sortedEntries.length - 2]

  const calories = sortedEntries.map(e => e.caloriesConsumed)
  const steps = sortedEntries.map(e => e.steps)
  const fatigue = sortedEntries.map(e => e.fatigueLevel)

  return {
    currentWeight: latest.weight,
    weightChange: previous ? latest.weight - previous.weight : 0,
    avgCalories: Math.round(calories.reduce((sum, c) => sum + c, 0) / calories.length),
    totalSteps: steps.reduce((sum, s) => sum + s, 0),
    avgSteps: Math.round(steps.reduce((sum, s) => sum + s, 0) / steps.length),
    avgFatigue: Math.round((fatigue.reduce((sum, f) => sum + f, 0) / fatigue.length) * 10) / 10,
    latestFatigue: latest.fatigueLevel,
    dateRange: {
      start: sortedEntries[0].date,
      end: latest.date,
      days: sortedEntries.length
    }
  }
}
