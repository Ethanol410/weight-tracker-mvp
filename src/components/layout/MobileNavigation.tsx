'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, BarChart3, Home, LogOut } from 'lucide-react'
import { useState } from 'react'

interface MobileNavigationProps {
  onLogout?: () => void
  isLoggingOut?: boolean
}

export default function MobileNavigation({ onLogout, isLoggingOut = false }: MobileNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLocalLoggingOut, setIsLocalLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      setIsLocalLoggingOut(true)
      try {
        await fetch('/api/auth/logout', {
          method: 'POST'
        })
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        setIsLocalLoggingOut(false)
      }
    }
  }

  const isLoggingOutState = isLoggingOut || isLocalLoggingOut

  const navigationItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Accueil',
      isActive: pathname === '/dashboard'
    },
    {
      href: '/entry',
      icon: Plus,
      label: 'Entrée',
      isActive: pathname === '/entry'
    },
    {
      href: '/charts',
      icon: BarChart3,
      label: 'Graphiques',
      isActive: pathname === '/charts'
    }
  ]

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              item.isActive
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`h-5 w-5 ${item.isActive ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium truncate ${item.isActive ? 'text-blue-600' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </Link>
        ))}
        
        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOutState}
          className="flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-0 flex-1"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs font-medium truncate">
            {isLoggingOutState ? 'Sortie...' : 'Sortir'}
          </span>
        </button>
      </div>
    </div>
  )
}
