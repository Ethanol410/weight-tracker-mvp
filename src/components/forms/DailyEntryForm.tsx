'use client'

import { useState, useEffect } from 'react'
import { formatDateInput } from '@/lib/utils'
import { DailyEntry } from '@/types'
import { animationClasses } from '@/lib/animations'

interface DailyEntryFormData {
  date: string
  weight: number
  fatigueLevel: number
  caloriesConsumed: number
  steps: number
}

interface DailyEntryFormProps {
  onSubmit: (data: DailyEntryFormData) => void
  onCancel?: () => void
  initialData?: Partial<DailyEntry>
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export default function DailyEntryForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false,
  mode = 'create'
}: DailyEntryFormProps) {
  const [formData, setFormData] = useState({
    date: formatDateInput(new Date()),
    weight: '',
    fatigueLevel: '5',
    caloriesConsumed: '',
    steps: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date ? formatDateInput(new Date(initialData.date)) : formatDateInput(new Date()),
        weight: initialData.weight?.toString() || '',
        fatigueLevel: initialData.fatigueLevel?.toString() || '5',
        caloriesConsumed: initialData.caloriesConsumed?.toString() || '',
        steps: initialData.steps?.toString() || ''
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = 'La date est requise'
    }

    const weight = parseFloat(formData.weight)
    if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) {
      newErrors.weight = 'Le poids doit être entre 30 et 300 kg'
    }

    const fatigueLevel = parseInt(formData.fatigueLevel)
    if (isNaN(fatigueLevel) || fatigueLevel < 1 || fatigueLevel > 10) {
      newErrors.fatigueLevel = 'Le niveau de fatigue doit être entre 1 et 10'
    }

    const calories = parseInt(formData.caloriesConsumed)
    if (!formData.caloriesConsumed || isNaN(calories) || calories < 0 || calories > 10000) {
      newErrors.caloriesConsumed = 'Les calories doivent être entre 0 et 10000'
    }    const steps = parseInt(formData.steps)
    if (!formData.steps || isNaN(steps) || steps < 0 || steps > 100000) {
      newErrors.steps = 'Le nombre de pas doit être entre 0 et 100000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // First, validate the form
    const isValid = validateForm()
    
    // Mark all fields as touched to show validation errors
    setTouched({
      date: true,
      weight: true,
      fatigueLevel: true,
      caloriesConsumed: true,
      steps: true
    })
    
    if (!isValid) {
      return
    }

    const submitData = {
      date: formData.date,
      weight: parseFloat(formData.weight),
      fatigueLevel: parseInt(formData.fatigueLevel),
      caloriesConsumed: parseInt(formData.caloriesConsumed),
      steps: parseInt(formData.steps)
    }

    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Validate the specific field on blur
    const newErrors: Record<string, string> = {}
    
    if (name === 'weight') {
      const weight = parseFloat(formData.weight)
      if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) {
        newErrors.weight = 'Le poids doit être entre 30 et 300 kg'
      }
    }
    
    if (name === 'caloriesConsumed') {
      const calories = parseInt(formData.caloriesConsumed)
      if (!formData.caloriesConsumed || isNaN(calories) || calories < 0 || calories > 10000) {
        newErrors.caloriesConsumed = 'Les calories doivent être entre 0 et 10000'
      }
    }
    
    if (name === 'steps') {
      const steps = parseInt(formData.steps)
      if (!formData.steps || isNaN(steps) || steps < 0 || steps > 100000) {
        newErrors.steps = 'Le nombre de pas doit être entre 0 et 100000'
      }
    }
    
    if (name === 'date') {
      if (!formData.date) {
        newErrors.date = 'La date est requise'
      }
    }
    
    if (name === 'fatigueLevel') {
      const fatigueLevel = parseInt(formData.fatigueLevel)
      if (isNaN(fatigueLevel) || fatigueLevel < 1 || fatigueLevel > 10) {
        newErrors.fatigueLevel = 'Le niveau de fatigue doit être entre 1 et 10'
      }
    }
    
    // Update errors for this field
    setErrors(prev => ({
      ...prev,
      [name]: newErrors[name] || ''
    }))
  }

  const getFieldError = (fieldName: string) => {
    return touched[fieldName] ? errors[fieldName] : ''
  }

  return (
    <div className={`max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 ${animationClasses.fadeInUp}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {mode === 'edit' ? 'Modifier l\'entrée' : 'Nouvelle entrée quotidienne'}
        </h2>
        <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Field */}
        <div className={`space-y-1 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.1s' }}>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              getFieldError('date') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            required
          />
          {getFieldError('date') && (
            <p className="text-sm text-red-600 animate-shake">{getFieldError('date')}</p>
          )}
        </div>

        {/* Weight Field */}
        <div className={`space-y-1 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.2s' }}>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Poids (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.1"
              min="30"
              max="300"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                getFieldError('weight') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ex: 70.5"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">kg</span>
            </div>
          </div>
          {getFieldError('weight') && (
            <p className="text-sm text-red-600 animate-shake">{getFieldError('weight')}</p>
          )}
        </div>

        {/* Fatigue Level Field */}
        <div className={`space-y-1 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.3s' }}>
          <label htmlFor="fatigueLevel" className="block text-sm font-medium text-gray-700">
            Niveau de fatigue (1-10)
          </label>
          <div className="relative">
            <select
              id="fatigueLevel"
              name="fatigueLevel"
              value={formData.fatigueLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                getFieldError('fatigueLevel') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <option key={level} value={level}>
                  {level} - {level <= 3 ? 'Très faible' : level <= 5 ? 'Modérée' : level <= 7 ? 'Élevée' : 'Très élevée'}
                </option>
              ))}
            </select>
            {/* Visual indicator */}
            <div className="mt-1 flex space-x-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-full rounded-full transition-all duration-200 ${
                    i < parseInt(formData.fatigueLevel) 
                      ? i < 3 ? 'bg-green-400' : i < 6 ? 'bg-yellow-400' : i < 8 ? 'bg-orange-400' : 'bg-red-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          {getFieldError('fatigueLevel') && (
            <p className="text-sm text-red-600 animate-shake">{getFieldError('fatigueLevel')}</p>
          )}
        </div>

        {/* Calories Field */}
        <div className={`space-y-1 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.4s' }}>
          <label htmlFor="caloriesConsumed" className="block text-sm font-medium text-gray-700">
            Calories consommées
          </label>
          <div className="relative">
            <input
              type="number"
              id="caloriesConsumed"
              name="caloriesConsumed"
              value={formData.caloriesConsumed}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              max="10000"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                getFieldError('caloriesConsumed') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ex: 2000"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">kcal</span>
            </div>
          </div>
          {getFieldError('caloriesConsumed') && (
            <p className="text-sm text-red-600 animate-shake">{getFieldError('caloriesConsumed')}</p>
          )}
        </div>

        {/* Steps Field */}
        <div className={`space-y-1 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.5s' }}>
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
            Nombre de pas
          </label>
          <div className="relative">
            <input
              type="number"
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              max="100000"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                getFieldError('steps') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ex: 8000"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">👟</span>
            </div>
          </div>
          {getFieldError('steps') && (
            <p className="text-sm text-red-600 animate-shake">{getFieldError('steps')}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 pt-4 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.6s' }}>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md font-medium shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${animationClasses.hoverLift}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'edit' ? 'Modification...' : 'Enregistrement...'}
              </div>
            ) : (
              mode === 'edit' ? 'Modifier l\'entrée' : 'Enregistrer l\'entrée'
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 bg-gray-600 text-white py-2 px-4 rounded-md font-medium shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ${animationClasses.hoverLift}`}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
