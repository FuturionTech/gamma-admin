import type { Service } from '../types'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from './useServiceFormatters'

export const useServiceActions = () => {
  const servicesStore = useServicesStore()
  const { formatDate } = useServiceFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a service
   */
  const confirmAndDeleteService = async (service: Service): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the service "${service.title}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this service.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await servicesStore.deleteService(service.id)
      showSuccess('Service deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete service')
      return false
    }
  }

  /**
   * Toggle service active status
   */
  const toggleServiceStatus = async (service: Service): Promise<boolean> => {
    const actionText = service.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the service "${service.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await servicesStore.toggleServiceStatus(service.id)

      const successMessage = service.is_active
        ? 'Service deactivated successfully'
        : 'Service activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete services
   */
  const bulkDeleteServices = async (serviceIds: string[]): Promise<boolean> => {
    if (serviceIds.length === 0) {
      showError('No services selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${serviceIds.length} service(s)?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await servicesStore.bulkDelete(serviceIds)
      showSuccess(`${serviceIds.length} service(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete service')
      return false
    }
  }

  /**
   * Export services to CSV
   */
  const exportServicesToCSV = (): void => {
    const services = servicesStore.filteredServices

    if (services.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Title',
        'Category',
        'Slug',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = services.map(service => [
        service.id,
        service.title,
        service.category || '',
        service.slug,
        service.is_active ? 'Active' : 'Inactive',
        service.order.toString(),
        formatDate(service.created_at),
        formatDate(service.updated_at)
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
      link.setAttribute('download', `services-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Services exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export services')
    }
  }

  /**
   * Duplicate a service
   */
  const duplicateService = async (service: Service): Promise<boolean> => {
    try {
      const newService = {
        title: `${service.title} (Copy)`,
        description: service.description,
        icon: service.icon,
        category: service.category,
        slug: `${service.slug}-copy-${Date.now()}`,
        order: service.order + 1,
        is_active: false // Start as inactive
      }

      await servicesStore.createService(newService)
      showSuccess('Service duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate service')
      return false
    }
  }

  return {
    confirmAndDeleteService,
    toggleServiceStatus,
    bulkDeleteServices,
    exportServicesToCSV,
    duplicateService
  }
}
