import type { JobPosition } from '../types'
import { useCareersStore } from '../stores/useCareersStore'
import { useCareerFormatters } from './useCareerFormatters'

export const useCareerActions = () => {
  const careersStore = useCareersStore()
  const { formatDate } = useCareerFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a job position
   */
  const confirmAndDeleteJobPosition = async (jobPosition: JobPosition): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete "${jobPosition.title}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this job position.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await careersStore.deleteJobPosition(jobPosition.id)
      showSuccess('Job position deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete job position')
      return false
    }
  }

  /**
   * Toggle job position status (ACTIVE <-> CLOSED)
   */
  const toggleJobPositionStatus = async (jobPosition: JobPosition): Promise<boolean> => {
    const action = jobPosition.status === 'ACTIVE' ? 'close' : 'open'

    const confirmed = confirm(
      `Are you sure you want to ${action} the job position "${jobPosition.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await careersStore.toggleJobPositionStatus(jobPosition.id)

      const successMessage = jobPosition.status === 'ACTIVE'
        ? 'Job position closed successfully'
        : 'Job position opened successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete job positions
   */
  const bulkDeleteJobPositions = async (jobPositionIds: string[]): Promise<boolean> => {
    if (jobPositionIds.length === 0) {
      showError('No job positions selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${jobPositionIds.length} job position(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete these job positions.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await careersStore.bulkDelete(jobPositionIds)
      showSuccess(`${jobPositionIds.length} job position(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete job positions')
      return false
    }
  }

  /**
   * Export job positions to CSV
   */
  const exportJobPositionsToCSV = (): void => {
    const jobPositions = careersStore.filteredJobPositions

    if (jobPositions.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Title',
        'Department',
        'Location',
        'Type',
        'Remote',
        'Salary Range',
        'Experience Required',
        'Status',
        'Posted Date',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = jobPositions.map(jp => [
        jp.id,
        jp.title,
        jp.department || '',
        jp.location || '',
        jp.job_type,
        jp.is_remote ? 'Yes' : 'No',
        jp.salary_range || '',
        jp.experience_required || '',
        jp.status,
        formatDate(jp.posted_date),
        formatDate(jp.created_at),
        formatDate(jp.updated_at)
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
      link.setAttribute('download', `job-positions-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Job positions exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export job positions')
    }
  }

  return {
    confirmAndDeleteJobPosition,
    toggleJobPositionStatus,
    bulkDeleteJobPositions,
    exportJobPositionsToCSV
  }
}
