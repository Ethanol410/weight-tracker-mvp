import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Weight Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Suivez votre évolution physique de manière simple et rapide
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/register"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Créer un compte
          </Link>
          
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Se connecter
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>📊 Suivi du poids • 😴 Niveau de fatigue</p>
          <p>🍽️ Calories consommées • 👟 Nombre de pas</p>
        </div>
      </div>
    </div>
  )
}
