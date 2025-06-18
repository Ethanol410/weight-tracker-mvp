'use client'

import { formatDate } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { DailyEntry } from '@/types'

interface EntriesListProps {
  entries: DailyEntry[]
  onEdit: (entry: DailyEntry) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function EntriesList({ entries, onEdit, onDelete, isLoading = false }: EntriesListProps) {
  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">Aucune entrée trouvée</p>
          <p className="text-sm">Commencez par ajouter votre première entrée quotidienne.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Vos entrées récentes ({entries.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {entries.map((entry) => (
          <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {formatDate(new Date(entry.date))}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Poids</span>
                    <span className="font-medium text-blue-600">{entry.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Fatigue</span>
                    <span className="font-medium text-orange-600">{entry.fatigueLevel}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Calories</span>
                    <span className="font-medium text-green-600">{entry.caloriesConsumed.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Pas</span>
                    <span className="font-medium text-purple-600">{entry.steps.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Modifier cette entrée"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer cette entrée"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
