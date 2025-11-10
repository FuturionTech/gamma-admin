import type { Stat } from '../types'
import { useStatsStore } from '../stores/useStatsStore'
import { useStatFormatters } from './useStatFormatters'

export const useStatActions = () => {
  const statsStore = useStatsStore()
  const { formatDate } = useStatFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a stat
   */
  const confirmAndDeleteStat = async (stat: Stat): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete "${stat.label}"?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await statsStore.deleteStat(stat.id)
      showSuccess('Statistic deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete statistic')
      return false
    }
  }

  /**
   * Toggle stat active status
   */
  const toggleStatStatus = async (stat: Stat): Promise<boolean> => {
    const actionText = stat.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the statistic "${stat.label}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await statsStore.toggleStatStatus(stat.id)

      const successMessage = stat.is_active
        ? 'Statistic deactivated successfully'
        : 'Statistic activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete stats
   */
  const bulkDeleteStats = async (statIds: string[]): Promise<boolean> => {
    if (statIds.length === 0) {
      showError('No statistics selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${statIds.length} statistic(s)?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await statsStore.bulkDelete(statIds)
      showSuccess(`${statIds.length} statistic(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete statistics')
      return false
    }
  }

  /**
   * Export stats to CSV
   */
  const exportStatsToCSV = (): void => {
    const stats = statsStore.filteredStats

    if (stats.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Label',
        'Value',
        'Unit',
        'Icon',
        'Order',
        'Status',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = stats.map(stat => [
        stat.id,
        stat.label,
        stat.value,
        stat.unit || '',
        stat.icon || '',
        stat.order.toString(),
        stat.is_active ? 'Active' : 'Inactive',
        formatDate(stat.created_at),
        formatDate(stat.updated_at)
      ])

      // Escape CSV fields that contain commas or quotes
      const escapeCSVField = (field: string): string => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      // Build CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row.map(field => escapeCSVField(field)).join(',')
        )
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `stats-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Statistics exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export statistics')
    }
  }

  /**
   * Duplicate a stat
   */
  const duplicateStat = async (stat: Stat): Promise<boolean> => {
    try {
      const newStat = {
        application_id: stat.application_id,
        label: `${stat.label} (Copy)`,
        value: stat.value,
        unit: stat.unit,
        icon: stat.icon,
        order: stat.order + 1,
        is_active: false // Start as inactive
      }

      await statsStore.createStat(newStat)
      showSuccess('Statistic duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate statistic')
      return false
    }
  }

  /**
   * Move stat up in order
   */
  const moveStatUp = async (stat: Stat): Promise<boolean> => {
    const stats = statsStore.sortedStats
    const currentIndex = stats.findIndex(s => s.id === stat.id)

    if (currentIndex <= 0) {
      showError('This statistic is already in first position')
      return false
    }

    try {
      // Swap orders
      const previousStat = stats[currentIndex - 1]
      await statsStore.updateStat(stat.id, { order: previousStat.order })
      await statsStore.updateStat(previousStat.id, { order: stat.order })

      showSuccess('Order updated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to update order')
      return false
    }
  }

  /**
   * Move stat down in order
   */
  const moveStatDown = async (stat: Stat): Promise<boolean> => {
    const stats = statsStore.sortedStats
    const currentIndex = stats.findIndex(s => s.id === stat.id)

    if (currentIndex >= stats.length - 1) {
      showError('This statistic is already in last position')
      return false
    }

    try {
      // Swap orders
      const nextStat = stats[currentIndex + 1]
      await statsStore.updateStat(stat.id, { order: nextStat.order })
      await statsStore.updateStat(nextStat.id, { order: stat.order })

      showSuccess('Order updated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to update order')
      return false
    }
  }

  return {
    confirmAndDeleteStat,
    toggleStatStatus,
    bulkDeleteStats,
    exportStatsToCSV,
    duplicateStat,
    moveStatUp,
    moveStatDown
  }
}
