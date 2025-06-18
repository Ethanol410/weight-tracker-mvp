import { DailyEntry } from '@/types'

export function exportToCSV(entries: DailyEntry[], filename: string = 'weight-tracker-data') {
  if (entries.length === 0) {
    throw new Error('Aucune donnée à exporter')
  }

  // Créer les en-têtes CSV
  const headers = [
    'Date',
    'Poids (kg)',
    'Niveau de fatigue (/10)',
    'Calories consommées',
    'Nombre de pas',
    'Créé le',
    'Modifié le'
  ]

  // Convertir les données en format CSV
  const csvData = entries.map(entry => [
    new Date(entry.date).toLocaleDateString('fr-FR'),
    entry.weight.toString(),
    entry.fatigueLevel.toString(),
    entry.caloriesConsumed.toString(),
    entry.steps.toString(),
    new Date(entry.createdAt).toLocaleString('fr-FR'),
    new Date(entry.updatedAt).toLocaleString('fr-FR')
  ])

  // Combiner en-têtes et données
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n')

  // Créer et télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function generateSummaryReport(entries: DailyEntry[]): string {
  if (entries.length === 0) return 'Aucune donnée disponible'

  const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const weights = entries.map(e => e.weight)
  const calories = entries.map(e => e.caloriesConsumed)
  const steps = entries.map(e => e.steps)
  const fatigue = entries.map(e => e.fatigueLevel)

  const stats = {
    totalEntries: entries.length,
    dateRange: {
      start: sortedEntries[0].date,
      end: sortedEntries[sortedEntries.length - 1].date
    },
    weight: {
      min: Math.min(...weights),
      max: Math.max(...weights),
      avg: weights.reduce((sum, w) => sum + w, 0) / weights.length,
      change: weights[weights.length - 1] - weights[0]
    },
    calories: {
      min: Math.min(...calories),
      max: Math.max(...calories),
      avg: calories.reduce((sum, c) => sum + c, 0) / calories.length,
      total: calories.reduce((sum, c) => sum + c, 0)
    },
    steps: {
      min: Math.min(...steps),
      max: Math.max(...steps),
      avg: steps.reduce((sum, s) => sum + s, 0) / steps.length,
      total: steps.reduce((sum, s) => sum + s, 0)
    },
    fatigue: {
      min: Math.min(...fatigue),
      max: Math.max(...fatigue),
      avg: fatigue.reduce((sum, f) => sum + f, 0) / fatigue.length
    }
  }

  return `
RAPPORT DE SUIVI - WEIGHT TRACKER
Généré le: ${new Date().toLocaleString('fr-FR')}

PÉRIODE D'ANALYSE
Du: ${new Date(stats.dateRange.start).toLocaleDateString('fr-FR')}
Au: ${new Date(stats.dateRange.end).toLocaleDateString('fr-FR')}
Nombre d'entrées: ${stats.totalEntries}

ÉVOLUTION DU POIDS
Poids initial: ${weights[0].toFixed(1)} kg
Poids final: ${weights[weights.length - 1].toFixed(1)} kg
Évolution: ${stats.weight.change >= 0 ? '+' : ''}${stats.weight.change.toFixed(1)} kg
Poids minimum: ${stats.weight.min.toFixed(1)} kg
Poids maximum: ${stats.weight.max.toFixed(1)} kg
Poids moyen: ${stats.weight.avg.toFixed(1)} kg

CALORIES
Minimum journalier: ${stats.calories.min} kcal
Maximum journalier: ${stats.calories.max} kcal
Moyenne journalière: ${stats.calories.avg.toFixed(0)} kcal
Total sur la période: ${stats.calories.total.toLocaleString()} kcal

ACTIVITÉ PHYSIQUE
Minimum de pas/jour: ${stats.steps.min.toLocaleString()}
Maximum de pas/jour: ${stats.steps.max.toLocaleString()}
Moyenne de pas/jour: ${stats.steps.avg.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
Total de pas: ${stats.steps.total.toLocaleString()}

NIVEAU DE FATIGUE
Minimum: ${stats.fatigue.min}/10
Maximum: ${stats.fatigue.max}/10
Moyenne: ${stats.fatigue.avg.toFixed(1)}/10
  `.trim()
}
