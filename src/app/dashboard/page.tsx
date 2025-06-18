'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, BarChart3, Calendar, LogOut, Activity, TrendingUp } from 'lucide-react'
import { animationClasses } from '@/lib/animations'
import { useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const quickActions = [
    {
      href: '/entry',
      icon: Plus,
      title: 'Nouvelle entrée',
      description: 'Enregistrer vos données du jour',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      delay: '0.1s'
    },
    {
      href: '/charts',
      icon: BarChart3,
      title: 'Voir les graphiques',
      description: 'Analyser votre progression',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      delay: '0.2s'
    },
    {
      href: '/entry',
      icon: Calendar,
      title: 'Historique',
      description: 'Consulter vos entrées passées',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      delay: '0.3s'
    }
  ]

  const stats = [
    {
      icon: Activity,
      label: 'Entrées cette semaine',
      value: '5',
      change: '+2 par rapport à la semaine dernière',
      changeType: 'positive',
      delay: '0.4s'
    },
    {
      icon: TrendingUp,
      label: 'Tendance du poids',
      value: '↓ 0.8kg',
      change: 'Progression en cours',
      changeType: 'positive',
      delay: '0.5s'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${animationClasses.fadeIn}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className={animationClasses.slideInRight}>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">📊</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Weight Tracker
                  </h1>
                  <p className="text-sm text-gray-600">Tableau de bord personnel</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed ${animationClasses.hoverLift}`}
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className={`text-center ${animationClasses.fadeInUp}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bonjour ! 👋
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Prêt à suivre votre progression aujourd&apos;hui ?
            </p>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${animationClasses.slideInRight}`}>
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 border border-gray-100 group ${animationClasses.hoverLift} ${animationClasses.slideInRight}`}
                  style={{ animationDelay: action.delay }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} ${action.hoverColor} transition-colors duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${animationClasses.slideInRight}`}>
              Statistiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${animationClasses.slideInRight}`}
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <stat.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 ${animationClasses.slideInRight}`} style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-xl">💡</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Conseil du jour
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Pour des résultats plus précis, pesez-vous toujours à la même heure, 
                  de préférence le matin à jeun. La régularité est la clé du succès !
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-only bottom spacing */}
          <div className="h-4 sm:h-0"></div>
        </div>
      </div>
    </div>
  )
}
