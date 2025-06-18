'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { animationClasses } from '@/lib/animations'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (message) {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [message])

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    switch (name) {
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
        }
        break
    }
    
    return errors
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setFieldErrors({})
    
    // Mark all fields as touched to show validation errors
    setTouched({
      email: true,
      password: true
    })

    // Validate all fields
    const allErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => {
      const fieldErrors = validateField(key, value)
      Object.assign(allErrors, fieldErrors)
    })

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Erreur lors de la connexion')
      }    } catch {
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
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre tableau de bord personnel
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          {showSuccessMessage && message && (
            <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-md ${animationClasses.slideInRight}`}>
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          {error && (
            <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-md ${animationClasses.shake}`}>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.1s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 ${
                    getFieldError('email') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="votre@email.com"
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{getFieldError('email')}</p>
                )}
              </div>
            </div>

            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 ${
                    getFieldError('password') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Votre mot de passe"
                />
                {getFieldError('password') && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{getFieldError('password')}</p>
                )}
              </div>
            </div>

            <div className={animationClasses.slideInRight} style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${animationClasses.hoverLift}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            <div className={`text-center ${animationClasses.slideInRight}`} style={{ animationDelay: '0.4s' }}>
              <Link 
                href="/register" 
                className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors duration-200"
              >
                Pas encore de compte ? S&apos;inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
