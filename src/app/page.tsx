import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              {/* Logo/Icon - smaller on desktop, centered on mobile */}
              <div className="mx-auto lg:mx-0 h-16 w-16 sm:h-20 sm:w-20 lg:h-16 lg:w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-8 lg:mb-6">
                <span className="text-white text-2xl sm:text-3xl lg:text-2xl">📊</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Weight Tracker
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl sm:text-2xl lg:text-xl xl:text-2xl text-gray-600 mb-8 lg:mb-10 max-w-3xl mx-auto lg:mx-0">
                Suivez votre évolution physique de manière simple et rapide
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center max-w-md mx-auto lg:mx-0">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🚀 Commencer gratuitement
                </Link>
                
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🔑 Se connecter
                </Link>
              </div>
            </div>

            {/* Right Column - Visual/Illustration for Desktop */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative background shapes */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-4 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                
                {/* Mock Dashboard Preview */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <div className="text-sm text-gray-500">Dashboard</div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="mb-6">
                    <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-around p-4">
                      <div className="w-4 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                      <div className="w-4 bg-purple-400 rounded-t" style={{height: '80%'}}></div>
                      <div className="w-4 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
                      <div className="w-4 bg-purple-500 rounded-t" style={{height: '90%'}}></div>
                      <div className="w-4 bg-blue-600 rounded-t" style={{height: '85%'}}></div>
                    </div>
                  </div>
                  
                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Poids actuel</div>
                      <div className="text-lg font-bold text-gray-900">75.2 kg</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Progression</div>
                      <div className="text-lg font-bold text-green-600">-2.8 kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités puissantes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour suivre efficacement votre progression
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Suivi du poids</h3>
              <p className="text-gray-600 text-sm">Enregistrement quotidien avec graphiques de progression</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-4xl mb-4">😴</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Niveau de fatigue</h3>
              <p className="text-gray-600 text-sm">Échelle de 1 à 10 pour tracker votre énergie</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calories</h3>
              <p className="text-gray-600 text-sm">Suivi des calories consommées quotidiennement</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200">
              <div className="text-4xl mb-4">👟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nombre de pas</h3>
              <p className="text-gray-600 text-sm">Comptabilisation de votre activité physique</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Simple. Efficace. Gratuit.
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">📱</div>
              <div className="text-lg font-semibold mb-1">Responsive</div>
              <div className="text-blue-100 text-sm">Parfait sur mobile et desktop</div>
            </div>
            
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">🔒</div>
              <div className="text-lg font-semibold mb-1">Sécurisé</div>
              <div className="text-blue-100 text-sm">Vos données sont protégées</div>
            </div>
            
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">📊</div>
              <div className="text-lg font-semibold mb-1">Graphiques</div>
              <div className="text-blue-100 text-sm">Visualisation interactive</div>
            </div>
          </div>
          
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ✨ Commencer maintenant - C&apos;est gratuit !
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">📊</span>
            </div>
            <span className="text-xl font-bold">Weight Tracker</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Weight Tracker. Suivez votre progression en toute simplicité.
          </p>
        </div>
      </footer>
    </div>
  )
}
