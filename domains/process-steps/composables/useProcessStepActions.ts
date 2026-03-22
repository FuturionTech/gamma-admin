import type { ProcessStep, ProcessStepItem } from '../types'
import { useProcessStepsStore } from '../stores/useProcessStepsStore'
import { useProcessStepFormatters } from './useProcessStepFormatters'

export const useProcessStepActions = () => {
  const processStepsStore = useProcessStepsStore()
  const { formatDate } = useProcessStepFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a process step
   */
  const confirmAndDeleteProcessStep = async (processStep: ProcessStep): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the process step "${processStep.title}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this process step and all its items.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await processStepsStore.deleteProcessStep(processStep.id)
      showSuccess('Process step deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete process step')
      return false
    }
  }

  /**
   * Toggle process step active status
   */
  const toggleProcessStepStatus = async (processStep: ProcessStep): Promise<boolean> => {
    const actionText = processStep.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the process step "${processStep.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await processStepsStore.toggleProcessStepStatus(processStep.id)

      const successMessage = processStep.is_active
        ? 'Process step deactivated successfully'
        : 'Process step activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete process steps
   */
  const bulkDeleteProcessSteps = async (ids: string[]): Promise<boolean> => {
    if (ids.length === 0) {
      showError('No process steps selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${ids.length} process step(s)?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await processStepsStore.bulkDelete(ids)
      showSuccess(`${ids.length} process step(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete process steps')
      return false
    }
  }

  /**
   * Export process steps to CSV
   */
  const exportProcessStepsToCSV = (): void => {
    const processSteps = processStepsStore.filteredProcessSteps

    if (processSteps.length === 0) {
      showError('No data to export')
      return
    }

    try {
      const headers = [
        'ID',
        'Step #',
        'Title',
        'Short Description',
        'Slug',
        'Status',
        'Order',
        'Items Count',
        'Created At',
        'Updated At'
      ]

      const csvData = processSteps.map(step => [
        step.id,
        step.step_number.toString(),
        step.title,
        step.short_description || '',
        step.slug,
        step.is_active ? 'Active' : 'Inactive',
        step.order.toString(),
        (step.items?.length || 0).toString(),
        formatDate(step.created_at),
        formatDate(step.updated_at)
      ])

      const escapeCSVField = (field: string): string => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row.map(field => escapeCSVField(field)).join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `process-steps-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Process steps exported successfully')
    } catch (error: any) {
      showError('Failed to export process steps')
    }
  }

  /**
   * Confirm and delete a process step item
   */
  const confirmAndDeleteItem = async (item: ProcessStepItem): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the item "${item.title}"?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await processStepsStore.deleteItem(item.id)
      showSuccess('Item deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete item')
      return false
    }
  }

  return {
    confirmAndDeleteProcessStep,
    toggleProcessStepStatus,
    bulkDeleteProcessSteps,
    exportProcessStepsToCSV,
    confirmAndDeleteItem
  }
}
