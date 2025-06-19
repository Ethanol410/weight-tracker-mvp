'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { DailyEntry } from '@/types'
import { exportToCSV, generateSummaryReport } from '@/lib/export'

interface ExportButtonProps {
  entries: DailyEntry[]
  disabled?: boolean
}

export default function ExportButton({ entries, disabled = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleExportCSV = async () => {
    if (entries.length === 0) return

    setIsExporting(true)
    try {
      exportToCSV(entries, 'donnees-weight-tracker')
      setShowDropdown(false)
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error)
      alert('Erreur lors de l\'export des données')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportReport = async () => {
    if (entries.length === 0) return

    setIsExporting(true)
    try {
      const report = generateSummaryReport(entries)
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `rapport-weight-tracker-${new Date().toISOString().split('T')[0]}.txt`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      setShowDropdown(false)
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      alert('Erreur lors de la génération du rapport')
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || entries.length === 0 || isExporting}
        className={`
          inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors w-full sm:w-auto justify-center
          ${disabled || entries.length === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }
        `}
      >
        {isExporting ? (
          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
        ) : (
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        )}
        <span className="hidden sm:inline">{isExporting ? 'Export en cours...' : 'Exporter'}</span>
        <span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={handleExportCSV}
              className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-green-600" />
              <div className="flex-1 text-left">
                <div className="font-medium">CSV</div>
                <div className="text-xs text-gray-500 hidden sm:block">Excel compatible</div>
              </div>
            </button>
            
            <button
              onClick={handleExportReport}
              className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-medium">Rapport</div>
                <div className="text-xs text-gray-500 hidden sm:block">Statistiques détaillées</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
