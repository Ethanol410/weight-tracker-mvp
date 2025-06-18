'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import WeightChart from '@/components/charts/WeightChart'
import MetricsChart from '@/components/charts/MetricsChart'
import ChartFilters, { FilterOptions } from '@/components/charts/ChartFilters'
import SummaryCard from '@/components/charts/SummaryCard'
import ExportButton from '@/components/ui/ExportButton'
import { ChartSkeleton, CardSkeleton } from '@/components/ui/Loading'
import { DailyEntry } from '@/types'
import { ArrowLeft, BarChart3, LineChart, TrendingUp, Activity, Weight, Zap, Target, Footprints } from 'lucide-react'

export default function ChartsPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metricsChartType, setMetricsChartType] = useState<'line' | 'bar'>('line')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  // Charger les entrées
  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/entries')
      
      if (response.status === 401) {
        router.push('/login')
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries)
        setFilteredEntries(data.entries)
      } else {
        showMessage('error', 'Erreur lors du chargement des données')
      }
    } catch {
      showMessage('error', 'Erreur de connexion au serveur')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Fonction pour filtrer les données
  const applyFilters = useCallback((filters: FilterOptions) => {
    let filtered = [...entries]

    // Filtrage par date
    if (filters.dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case 'custom':
          if (filters.startDate) {
            startDate = new Date(filters.startDate)
            filtered = filtered.filter(entry => new Date(entry.date) >= startDate)
          }
          if (filters.endDate) {
            const endDate = new Date(filters.endDate)
            filtered = filtered.filter(entry => new Date(entry.date) <= endDate)
          }
          break
        default:
          startDate = new Date(0)
      }

      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(entry => new Date(entry.date) >= startDate)
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'weight-asc':
          return a.weight - b.weight
        case 'weight-desc':
          return b.weight - a.weight
        default: // 'date-asc'
          return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })

    setFilteredEntries(filtered)
  }, [entries])

  // Calculer les statistiques générales
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return null

    const weights = filteredEntries.map(e => e.weight)
    const calories = filteredEntries.map(e => e.caloriesConsumed)
    const steps = filteredEntries.map(e => e.steps)
    const fatigue = filteredEntries.map(e => e.fatigueLevel)

    return {
      totalEntries: filteredEntries.length,
      weightChange: weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0,
      avgCalories: calories.reduce((sum, c) => sum + c, 0) / calories.length,
      totalSteps: steps.reduce((sum, s) => sum + s, 0),
      avgFatigue: fatigue.reduce((sum, f) => sum + f, 0) / fatigue.length,
      dateRange: {
        start: new Date(Math.min(...filteredEntries.map(e => new Date(e.date).getTime()))),
        end: new Date(Math.max(...filteredEntries.map(e => new Date(e.date).getTime())))
      }
    }
  }, [filteredEntries])
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Retour au tableau de bord</span>
                <span className="sm:hidden">Retour</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visualisation</h1>
                <p className="text-xs sm:text-sm text-gray-600">Analysez votre évolution</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Export button */}
              <ExportButton entries={filteredEntries} />
              
              {/* Bouton type de graphique pour les métriques */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">Métriques:</span>
                <button
                  onClick={() => setMetricsChartType('line')}
                  className={`p-2 rounded-md transition-colors ${
                    metricsChartType === 'line' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Graphique en lignes"
                >
                  <LineChart className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setMetricsChartType('bar')}
                  className={`p-2 rounded-md transition-colors ${
                    metricsChartType === 'bar' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Graphique en barres"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Ajoutez des entrées quotidiennes pour voir vos graphiques et analyser vos tendances.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/entry')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Activity className="mr-2 h-4 w-4" />
                Ajouter une entrée
              </button>
            </div>
          </div>
        ) : (
          <>            {/* Statistiques générales */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                  title="Poids actuel"
                  value={`${filteredEntries[filteredEntries.length - 1]?.weight.toFixed(1)} kg`}
                  trend={stats.weightChange > 0 ? 'up' : stats.weightChange < 0 ? 'down' : 'neutral'}
                  subtitle={`${stats.weightChange >= 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg depuis la dernière mesure`}
                  icon={<Weight className="h-5 w-5" />}
                  color={stats.weightChange > 0 ? 'red' : stats.weightChange < 0 ? 'green' : 'blue'}
                />
                <SummaryCard
                  title="Niveau de fatigue"
                  value={`${filteredEntries[filteredEntries.length - 1]?.fatigueLevel}/10`}
                  subtitle={`Moyenne: ${stats.avgFatigue.toFixed(1)}/10`}
                  icon={<Zap className="h-5 w-5" />}
                  color="orange"
                />
                <SummaryCard
                  title="Calories moyennes"
                  value={`${stats.avgCalories} kcal`}
                  subtitle="Par jour sur la période"
                  icon={<Target className="h-5 w-5" />}
                  color="green"
                />
                <SummaryCard
                  title="Pas totaux"
                  value={stats.totalSteps.toLocaleString()}
                  subtitle={`Moyenne: ${Math.round(stats.totalSteps / stats.totalEntries).toLocaleString()} pas/jour`}
                  icon={<Footprints className="h-5 w-5" />}
                  color="purple"
                />
              </div>
            )}

            {/* Filtres */}
            <ChartFilters 
              onFilterChange={applyFilters}
              totalEntries={filteredEntries.length}
            />

            {/* Graphiques */}
            <div className="space-y-6">
              <WeightChart entries={filteredEntries} />
              <MetricsChart entries={filteredEntries} chartType={metricsChartType} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
