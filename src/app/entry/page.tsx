'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DailyEntryForm from '@/components/forms/DailyEntryForm'
import EntriesList from '@/components/forms/EntriesList'
import { Plus, ArrowLeft } from 'lucide-react'
import { DailyEntry } from '@/types'
import MobileNavigation from '@/components/layout/MobileNavigation'

interface DailyEntryFormData {
  date: string
  weight: number
  fatigueLevel: number
  caloriesConsumed: number
  steps: number
}

export default function EntryPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

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
      } else {
        showMessage('error', 'Erreur lors du chargement des entrées')
      }
    } catch {
      showMessage('error', 'Erreur de connexion au serveur')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Charger les entrées au montage
  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }
  const handleSubmit = async (data: DailyEntryFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = editingEntry ? `/api/entries/${editingEntry.id}` : '/api/entries'
      const method = editingEntry ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('success', result.message)
        setShowForm(false)
        setEditingEntry(null)
        fetchEntries() // Recharger la liste
      } else {
        showMessage('error', result.error || 'Erreur lors de l\'enregistrement')
      }
    } catch {
      showMessage('error', 'Erreur de connexion au serveur')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (entry: DailyEntry) => {
    setEditingEntry(entry)
    setShowForm(true)
  }
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      return
    }

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('success', result.message)
        fetchEntries() // Recharger la liste
      } else {
        showMessage('error', result.error || 'Erreur lors de la suppression')
      }
    } catch {
      showMessage('error', 'Erreur de connexion au serveur')
    }
  }
  const handleCancel = () => {
    setShowForm(false)
    setEditingEntry(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">{/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Saisie quotidienne
              </h1>            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex-1 sm:flex-none justify-center"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Nouvelle entrée</span>
                  <span className="sm:hidden">Nouvelle</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showForm ? (            <DailyEntryForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingEntry || undefined}
              isLoading={isSubmitting}
              mode={editingEntry ? 'edit' : 'create'}
            />
          ) : (
            <EntriesList
              entries={entries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />          )}
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNavigation />
    </div>
  )
}
