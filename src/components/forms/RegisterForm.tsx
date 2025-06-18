'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { animationClasses } from '@/lib/animations'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Le nom est requis'
        } else if (value.trim().length < 2) {
          errors.name = 'Le nom doit contenir au moins 2 caractères'
        }
        break
      case 'email':
        if (!value.trim()) {
          errors.email = 'L\'email est requis'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Format d\'email invalide'
        }
        break
      case 'password':
        if (!value) {
          errors.password = 'Le mot de passe est requis'
        } else if (value.length < 6) {
          errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
        }
        break
    }    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Validate all fields
    const allErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => {
      const fieldErrors = validateField(key, value)
      Object.assign(allErrors, fieldErrors)
    })

    if (Object.keys(allErrors).length > 0) {
      // Mark all fields as touched to show validation errors
      setTouched({
        name: true,
        email: true,
        password: true
      })
      setFieldErrors(allErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Inscription réussie, vous pouvez maintenant vous connecter')
      } else {
        setError(data.error || 'Erreur lors de l\'inscription')
      }
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear general error
    if (error) {
      setError('')
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    const errors = validateField(name, value)
    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }))
  }

  const getFieldError = (fieldName: string) => {
    return touched[fieldName] ? fieldErrors[fieldName] : ''
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 ${animationClasses.fadeIn}`}>
      <div className={`max-w-md w-full space-y-8 ${animationClasses.fadeInUp}`}>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">📊</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Commencez votre suivi de poids dès aujourd&apos;hui
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          {error && (
            <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-md ${animationClasses.shake}`}>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.1s' }}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1 relative">                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 ${
                    getFieldError('name') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Votre nom complet"
                />
                {getFieldError('name') && (
                  <div className="mt-1 text-sm text-red-600 animate-shake">{getFieldError('name')}</div>
                )}
              </div>
            </div>

            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 ${
                    getFieldError('email') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="votre@email.com"
                />
                {getFieldError('email') && (
                  <div className="mt-1 text-sm text-red-600 animate-shake">{getFieldError('email')}</div>
                )}
              </div>
            </div>

            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 ${
                    getFieldError('password') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Minimum 6 caractères"
                />
                {getFieldError('password') && (
                  <div className="mt-1 text-sm text-red-600 animate-shake">{getFieldError('password')}</div>
                )}
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-full rounded-full transition-all duration-200 ${
                            formData.password.length >= (i + 1) * 1.5 
                              ? formData.password.length < 6 ? 'bg-red-400' : formData.password.length < 8 ? 'bg-yellow-400' : 'bg-green-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Force du mot de passe: {formData.password.length < 6 ? 'Faible' : formData.password.length < 8 ? 'Moyenne' : 'Forte'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.4s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${animationClasses.hoverLift}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </div>

            <div className={`text-center ${animationClasses.slideInRight}`} style={{ animationDelay: '0.5s' }}>
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
