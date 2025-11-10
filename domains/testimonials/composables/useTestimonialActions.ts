import type { Testimonial } from '../types'
import { useTestimonialsStore } from '../stores/useTestimonialsStore'
import { useTestimonialFormatters } from './useTestimonialFormatters'

export const useTestimonialActions = () => {
  const testimonialsStore = useTestimonialsStore()
  const { formatDate } = useTestimonialFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a testimonial
   */
  const confirmAndDeleteTestimonial = async (testimonial: Testimonial): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the testimonial from "${testimonial.name}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this testimonial.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await testimonialsStore.deleteTestimonial(testimonial.id)
      showSuccess('Testimonial deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete testimonial')
      return false
    }
  }

  /**
   * Toggle testimonial active status
   */
  const toggleTestimonialStatus = async (testimonial: Testimonial): Promise<boolean> => {
    const action = testimonial.is_active ? 'deactivate' : 'activate'
    const actionText = testimonial.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the testimonial from "${testimonial.name}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await testimonialsStore.toggleTestimonialStatus(testimonial.id)

      const successMessage = testimonial.is_active
        ? 'Testimonial deactivated successfully'
        : 'Testimonial activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete testimonials
   */
  const bulkDeleteTestimonials = async (testimonialIds: string[]): Promise<boolean> => {
    if (testimonialIds.length === 0) {
      showError('No testimonials selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${testimonialIds.length} testimonial(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete these testimonials.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await testimonialsStore.bulkDelete(testimonialIds)
      showSuccess(`${testimonialIds.length} testimonial(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete testimonials')
      return false
    }
  }

  /**
   * Export testimonials to CSV
   */
  const exportTestimonialsToCSV = (): void => {
    const testimonials = testimonialsStore.filteredTestimonials

    if (testimonials.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Name',
        'Position',
        'Company',
        'Rating',
        'Content',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = testimonials.map(testimonial => [
        testimonial.id,
        testimonial.name,
        testimonial.position || '',
        testimonial.company || '',
        testimonial.rating.toString(),
        testimonial.content.replace(/\n/g, ' '),
        testimonial.is_active ? 'Active' : 'Inactive',
        testimonial.order.toString(),
        formatDate(testimonial.created_at),
        formatDate(testimonial.updated_at)
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
      link.setAttribute('download', `testimonials-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Testimonials exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export testimonials')
    }
  }

  /**
   * Duplicate a testimonial
   */
  const duplicateTestimonial = async (testimonial: Testimonial): Promise<boolean> => {
    try {
      const newTestimonial = {
        application_id: testimonial.application_id,
        name: testimonial.name,
        content: testimonial.content,
        image_url: testimonial.image_url,
        position: testimonial.position,
        company: testimonial.company,
        rating: testimonial.rating,
        order: testimonial.order + 1,
        is_active: false // Start as inactive
      }

      await testimonialsStore.createTestimonial(newTestimonial)
      showSuccess('Testimonial duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate testimonial')
      return false
    }
  }

  return {
    confirmAndDeleteTestimonial,
    toggleTestimonialStatus,
    bulkDeleteTestimonials,
    exportTestimonialsToCSV,
    duplicateTestimonial
  }
}
