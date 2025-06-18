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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filtre par période */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Période:</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value as FilterOptions['dateRange'])}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les données</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
            <option value="custom">Période personnalisée</option>
          </select>
        </div>

        {/* Dates personnalisées */}
        {showCustomDates && (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Date de début"
            />
            <span className="text-gray-500">à</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Date de fin"
            />
          </div>
        )}

        {/* Tri */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Trier par:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-asc">Date (croissant)</option>
            <option value="date-desc">Date (décroissant)</option>
            <option value="weight-asc">Poids (croissant)</option>
            <option value="weight-desc">Poids (décroissant)</option>
          </select>
        </div>

        {/* Bouton reset */}
        <button
          onClick={resetFilters}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Réinitialiser</span>
        </button>

        {/* Compteur d'entrées */}
        <div className="text-sm text-gray-500 ml-auto">
          {totalEntries} entrée{totalEntries > 1 ? 's' : ''} affichée{totalEntries > 1 ? 's' : ''}
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {(filters.dateRange !== 'all' || filters.sortBy !== 'date-asc') && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-600">Filtres actifs:</span>
            {filters.dateRange !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {getDateRangeLabel(filters.dateRange)}
              </span>
            )}
            {filters.sortBy !== 'date-asc' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Tri: {filters.sortBy === 'date-desc' ? 'Date (récent → ancien)' :
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
