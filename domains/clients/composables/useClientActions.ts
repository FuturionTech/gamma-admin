import type { Client } from '../types'
import { useClientsStore } from '../stores/useClientsStore'
import { useClientFormatters } from './useClientFormatters'

export const useClientActions = () => {
  const clientsStore = useClientsStore()
  const { formatDate } = useClientFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a client
   */
  const confirmAndDeleteClient = async (client: Client): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the client "${client.name}"?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await clientsStore.deleteClient(client.id)
      showSuccess('Client deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete client')
      return false
    }
  }

  /**
   * Toggle client active status
   */
  const toggleClientStatus = async (client: Client): Promise<boolean> => {
    const action = client.is_active ? 'deactivate' : 'activate'
    const actionText = client.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${actionText} the client "${client.name}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await clientsStore.toggleClientStatus(client.id)

      const successMessage = client.is_active
        ? 'Client deactivated successfully'
        : 'Client activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to update client status')
      return false
    }
  }

  /**
   * Bulk delete clients
   */
  const bulkDeleteClients = async (clientIds: string[]): Promise<boolean> => {
    if (clientIds.length === 0) {
      showError('No clients selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${clientIds.length} client(s)?`
    const warningMessage = 'This action is irreversible.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await clientsStore.bulkDelete(clientIds)
      showSuccess(`${clientIds.length} client(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete clients')
      return false
    }
  }

  /**
   * Export clients to CSV
   */
  const exportClientsToCSV = (): void => {
    const clients = clientsStore.filteredClients

    if (clients.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Name',
        'Industry',
        'Website',
        'Status',
        'Order',
        'Created At',
        'Updated At'
      ]

      // CSV Data
      const csvData = clients.map(client => [
        client.id,
        client.name,
        client.industry || '',
        client.website_url || '',
        client.is_active ? 'Active' : 'Inactive',
        client.order.toString(),
        formatDate(client.created_at),
        formatDate(client.updated_at)
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
      link.setAttribute('download', `clients-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Clients exported successfully')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export clients')
    }
  }

  return {
    confirmAndDeleteClient,
    toggleClientStatus,
    bulkDeleteClients,
    exportClientsToCSV
  }
}
