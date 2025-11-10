import type { Solution } from '../types'
import { useSolutionsStore } from '../stores/useSolutionsStore'
import { useSolutionFormatters } from './useSolutionFormatters'

export const useSolutionActions = () => {
  const solutionsStore = useSolutionsStore()
  const { formatDate } = useSolutionFormatters()
  const { showSuccess, showError } = useNotification()

  const confirmAndDeleteSolution = async (solution: Solution): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the solution "${solution.title}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this solution along with all its features and benefits.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await solutionsStore.deleteSolution(solution.id)
      showSuccess('Solution deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete solution')
      return false
    }
  }

  const toggleSolutionStatus = async (solution: Solution): Promise<boolean> => {
    const action = solution.is_active ? 'deactivate' : 'activate'
    const actionText = solution.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the solution "${solution.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await solutionsStore.toggleSolutionStatus(solution.id)

      const successMessage = solution.is_active
        ? 'Solution deactivated successfully'
        : 'Solution activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  const bulkDeleteSolutions = async (solutionIds: string[]): Promise<boolean> => {
    if (solutionIds.length === 0) {
      showError('No solution selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${solutionIds.length} solution(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete this solution along with all its features and benefits.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await solutionsStore.bulkDelete(solutionIds)
      showSuccess(`${solutionIds.length} solution(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete solution')
      return false
    }
  }

  const exportSolutionsToCSV = (): void => {
    const solutions = solutionsStore.filteredSolutions

    if (solutions.length === 0) {
      showError('No data to export')
      return
    }

    try {
      const headers = [
        'ID',
        'Title',
        'Subtitle',
        'Slug',
        'Status',
        'Order',
        'Features',
        'Benefits',
        'Created At',
        'Updated At'
      ]

      const csvData = solutions.map(solution => [
        solution.id,
        solution.title,
        solution.subtitle || '',
        solution.slug,
        solution.is_active ? 'Active' : 'Inactive',
        solution.order.toString(),
        (solution.features?.length || 0).toString(),
        (solution.benefits?.length || 0).toString(),
        formatDate(solution.created_at),
        formatDate(solution.updated_at)
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
      link.setAttribute('download', `solutions-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Solutions exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export solutions')
    }
  }

  const duplicateSolution = async (solution: Solution): Promise<boolean> => {
    try {
      const newSolution = {
        application_id: solution.application_id,
        title: `${solution.title} (Copy)`,
        subtitle: solution.subtitle,
        description: solution.description,
        icon: solution.icon,
        icon_color: solution.icon_color,
        hero_image_url: solution.hero_image_url,
        slug: `${solution.slug}-copy-${Date.now()}`,
        order: solution.order + 1,
        is_active: false
      }

      await solutionsStore.createSolution(newSolution)
      showSuccess('Solution duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate solution')
      return false
    }
  }

  return {
    confirmAndDeleteSolution,
    toggleSolutionStatus,
    bulkDeleteSolutions,
    exportSolutionsToCSV,
    duplicateSolution
  }
}
