import Swal from 'sweetalert2'
import type { Industry } from '../types'
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryFormatters } from './useIndustryFormatters'

export const useIndustryActions = () => {
  const industriesStore = useIndustriesStore()
  const { formatDate } = useIndustryFormatters()

  /**
   * Confirm and delete an industry
   */
  const confirmAndDeleteIndustry = async (industry: Industry): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete the industry "<strong>${industry.title}</strong>"?<br><small class="text-muted">This action is irreversible.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await industriesStore.deleteIndustry(industry.id)

        await Swal.fire({
          title: 'Deleted!',
          text: 'Industry deleted successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete industry',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  /**
   * Toggle industry active status
   */
  const toggleIndustryStatus = async (industry: Industry): Promise<boolean> => {
    const actionText = industry.is_active ? 'deactivate' : 'activate'

    const result = await Swal.fire({
      title: `${industry.is_active ? 'Deactivate' : 'Activate'} industry?`,
      html: `Are you sure you want to ${actionText} "<strong>${industry.title}</strong>"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: industry.is_active ? '#d97706' : '#059669',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await industriesStore.toggleIndustryStatus(industry.id)

        const successMessage = industry.is_active
          ? 'Industry deactivated successfully'
          : 'Industry activated successfully'

        await Swal.fire({
          title: 'Success',
          text: successMessage,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'An error occurred',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  /**
   * Bulk delete industries
   */
  const bulkDeleteIndustries = async (industryIds: string[]): Promise<boolean> => {
    if (industryIds.length === 0) {
      await Swal.fire({
        title: 'Warning',
        text: 'No industries selected',
        icon: 'warning'
      })
      return false
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete <strong>${industryIds.length}</strong> industry(ies)?<br><small class="text-muted">This action is irreversible.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await industriesStore.bulkDelete(industryIds)

        await Swal.fire({
          title: 'Deleted!',
          text: `${industryIds.length} industry(ies) deleted successfully`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete industries',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  /**
   * Export industries to CSV
   */
  const exportIndustriesToCSV = (): void => {
    const industries = industriesStore.filteredIndustries

    if (industries.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'No data to export',
        icon: 'warning'
      })
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Title',
        'Category',
        'Short Description',
        'Slug',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = industries.map(industry => [
        industry.id,
        industry.title,
        industry.category || '',
        industry.short_description || '',
        industry.slug,
        industry.is_active ? 'Active' : 'Inactive',
        industry.order.toString(),
        formatDate(industry.created_at),
        formatDate(industry.updated_at)
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
      link.setAttribute('download', `industries-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      Swal.fire({
        title: 'Success',
        text: 'Industries exported successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to export industries',
        icon: 'error'
      })
    }
  }

  /**
   * Duplicate an industry
   */
  const duplicateIndustry = async (industry: Industry): Promise<boolean> => {
    try {
      const newIndustry = {
        title: `${industry.title} (Copy)`,
        description: industry.description,
        short_description: industry.short_description,
        icon: industry.icon,
        icon_color: industry.icon_color,
        category: industry.category,
        slug: `${industry.slug}-copy-${Date.now()}`,
        order: industry.order + 1,
        is_active: false // Start as inactive
      }

      await industriesStore.createIndustry(newIndustry)

      await Swal.fire({
        title: 'Success',
        text: 'Industry duplicated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return true
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to duplicate industry',
        icon: 'error'
      })
      return false
    }
  }

  return {
    confirmAndDeleteIndustry,
    toggleIndustryStatus,
    bulkDeleteIndustries,
    exportIndustriesToCSV,
    duplicateIndustry
  }
}
