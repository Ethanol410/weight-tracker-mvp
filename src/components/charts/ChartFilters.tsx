'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter, RotateCcw } from 'lucide-react'

interface ChartFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  totalEntries: number
}

export interface FilterOptions {
  dateRange: 'all' | '7days' | '30days' | '90days' | 'custom'
  startDate?: string
  endDate?: string
  sortBy: 'date-asc' | 'date-desc' | 'weight-asc' | 'weight-desc'
}

export default function ChartFilters({ onFilterChange, totalEntries }: ChartFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    sortBy: 'date-asc'
  })

  const [showCustomDates, setShowCustomDates] = useState(false)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleDateRangeChange = (range: FilterOptions['dateRange']) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range,
      startDate: undefined,
      endDate: undefined
    }))
    setShowCustomDates(range === 'custom')
  }

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type === 'start' ? 'startDate' : 'endDate']: value
    }))
  }

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: 'all',
      sortBy: 'date-asc'
    })
    setShowCustomDates(false)
  }

  const getDateRangeLabel = (range: FilterOptions['dateRange']) => {
    switch (range) {
      case '7days': return '7 derniers jours'
      case '30days': return '30 derniers jours'
      case '90days': return '90 derniers jours'
      case 'custom': return 'Période personnalisée'
      default: return 'Toutes les données'
    }
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filtres et tri</h3>
              <p className="text-sm text-gray-600">Personnalisez votre analyse</p>
            </div>
          </div>
          
          {/* Compteur d'entrées */}
          <div className="bg-blue-100 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-blue-700">
              {totalEntries} entrée{totalEntries > 1 ? 's' : ''} affichée{totalEntries > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Contrôles principaux */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filtre par période */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <label className="text-sm font-semibold text-gray-700">Période d&apos;analyse</label>
            </div>
            <select
              value={filters.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value as FilterOptions['dateRange'])}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all shadow-sm"
            >
              <option value="all">📊 Toutes les données</option>
              <option value="7days">📅 7 derniers jours</option>
              <option value="30days">📆 30 derniers jours</option>
              <option value="90days">🗓️ 90 derniers jours</option>
              <option value="custom">🎯 Période personnalisée</option>
            </select>
          </div>

          {/* Tri */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-green-500" />
              <label className="text-sm font-semibold text-gray-700">Ordre d&apos;affichage</label>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all shadow-sm"
            >
              <option value="date-asc">📈 Date (ancien → récent)</option>
              <option value="date-desc">📉 Date (récent → ancien)</option>
              <option value="weight-asc">⬆️ Poids (léger → lourd)</option>
              <option value="weight-desc">⬇️ Poids (lourd → léger)</option>
            </select>
          </div>

          {/* Bouton reset */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-purple-500" />
              <label className="text-sm font-semibold text-gray-700">Actions</label>
            </div>
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        </div>

        {/* Dates personnalisées */}
        {showCustomDates && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <label className="text-sm font-semibold text-yellow-800">Définir une période personnalisée</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-yellow-700 mb-1">Date de début</label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="w-full text-sm border border-yellow-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-yellow-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="w-full text-sm border border-yellow-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résumé des filtres actifs */}
      {(filters.dateRange !== 'all' || filters.sortBy !== 'date-asc') && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">🎯 Filtres actifs:</span>
            {filters.dateRange !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                📅 {getDateRangeLabel(filters.dateRange)}
              </span>
            )}
            {filters.sortBy !== 'date-asc' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                🔄 {filters.sortBy === 'date-desc' ? 'Date (récent → ancien)' :
                      filters.sortBy === 'weight-asc' ? 'Poids (léger → lourd)' :
                      'Poids (lourd → léger)'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
