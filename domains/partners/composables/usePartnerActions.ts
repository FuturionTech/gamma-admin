import type { Partner } from '../types'
import { usePartnersStore } from '../stores/usePartnersStore'
import { usePartnerFormatters } from './usePartnerFormatters'

export const usePartnerActions = () => {
  const partnersStore = usePartnersStore()
  const { formatDate } = usePartnerFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a partner
   */
  const confirmAndDeletePartner = async (partner: Partner): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the partner "${partner.name}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this partner.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await partnersStore.deletePartner(partner.id)
      showSuccess('Partner deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete partner')
      return false
    }
  }

  /**
   * Toggle partner active status
   */
  const togglePartnerStatus = async (partner: Partner): Promise<boolean> => {
    const action = partner.is_active ? 'deactivate' : 'activate'
    const actionText = partner.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the partner "${partner.name}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await partnersStore.togglePartnerStatus(partner.id)

      const successMessage = partner.is_active
        ? 'Partner deactivated successfully'
        : 'Partner activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete partners
   */
  const bulkDeletePartners = async (partnerIds: string[]): Promise<boolean> => {
    if (partnerIds.length === 0) {
      showError('No partners selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${partnerIds.length} partner(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete these partners.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await partnersStore.bulkDelete(partnerIds)
      showSuccess(`${partnerIds.length} partner(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete partners')
      return false
    }
  }

  /**
   * Export partners to CSV
   */
  const exportPartnersToCSV = (): void => {
    const partners = partnersStore.filteredPartners

    if (partners.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Name',
        'Website',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = partners.map(partner => [
        partner.id,
        partner.name,
        partner.website_url || '',
        partner.is_active ? 'Active' : 'Inactive',
        partner.order.toString(),
        formatDate(partner.created_at),
        formatDate(partner.updated_at)
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
      link.setAttribute('download', `partners-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Partners exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export partners')
    }
  }

  /**
   * Duplicate a partner
   */
  const duplicatePartner = async (partner: Partner): Promise<boolean> => {
    try {
      const newPartner = {
        name: `${partner.name} (Copy)`,
        logo_url: partner.logo_url,
        website_url: partner.website_url,
        order: partner.order + 1,
        is_active: false // Start as inactive
      }

      await partnersStore.createPartner(newPartner)
      showSuccess('Partner duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate partner')
      return false
    }
  }

  return {
    confirmAndDeletePartner,
    togglePartnerStatus,
    bulkDeletePartners,
    exportPartnersToCSV,
    duplicatePartner
  }
}
