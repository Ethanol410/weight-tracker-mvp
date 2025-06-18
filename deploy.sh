#!/bin/bash

# Script de déploiement pour Weight Tracker MVP
echo "🚀 Déploiement Weight Tracker MVP"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis le répertoire du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Construire l'application
echo "🏗️ Construction de l'application..."
npm run build

# Déployer sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est maintenant en ligne !"
echo "📊 Consultez le tableau de bord Vercel pour les métriques"
