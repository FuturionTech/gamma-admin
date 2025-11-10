import Swal from 'sweetalert2'
import { useContactRequestsStore } from '../stores/useContactRequestsStore'
import type { ContactRequest, ContactRequestStatus } from '../types'

export const useContactRequestActions = () => {
  const contactRequestsStore = useContactRequestsStore()

  const confirmAndDeleteContactRequest = async (contactRequest: ContactRequest): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete contact request from ${contactRequest.first_name} ${contactRequest.last_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await contactRequestsStore.deleteContactRequest(contactRequest.id)

        await Swal.fire({
          title: 'Deleted!',
          text: 'Contact request deleted successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete contact request',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  const updateStatus = async (contactRequestId: string, newStatus: ContactRequestStatus): Promise<boolean> => {
    try {
      await contactRequestsStore.updateContactRequestStatus(contactRequestId, newStatus)

      await Swal.fire({
        title: 'Success',
        text: 'Status updated successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return true
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update status',
        icon: 'error'
      })
      return false
    }
  }

  const bulkUpdateStatus = async (ids: string[], newStatus: ContactRequestStatus): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Update status for multiple requests?',
      html: `Update status for ${ids.length} contact request(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await contactRequestsStore.bulkUpdateStatus(ids, newStatus)

        await Swal.fire({
          title: 'Success',
          text: `${ids.length} contact request(s) updated successfully`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to update status',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  const bulkDeleteContactRequests = async (ids: string[]): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete ${ids.length} contact request(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await contactRequestsStore.bulkDelete(ids)

        await Swal.fire({
          title: 'Deleted!',
          text: `${ids.length} contact request(s) deleted successfully`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete contact requests',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  const exportContactRequestsToCSV = () => {
    const contactRequests = contactRequestsStore.filteredContactRequests

    if (contactRequests.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'No data to export',
        icon: 'warning'
      })
      return
    }

    // CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date']
    const csvRows = [headers.join(',')]

    // Add contact request data
    contactRequests.forEach(cr => {
      const row = [
        cr.id,
        `"${cr.first_name} ${cr.last_name}"`,
        cr.email,
        cr.phone || '',
        `"${(cr.subject || '').replace(/"/g, '""')}"`,
        `"${cr.message.replace(/"/g, '""')}"`,
        cr.status,
        new Date(cr.created_at).toLocaleDateString()
      ]
      csvRows.push(row.join(','))
    })

    // Create blob and download
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `contact_requests_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    Swal.fire({
      title: 'Success',
      text: 'Contact requests exported successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const copyEmailToClipboard = async (email: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email)
      await Swal.fire({
        title: 'Success',
        text: 'Email copied to clipboard',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Failed to copy email to clipboard',
        icon: 'error'
      })
    }
  }

  return {
    confirmAndDeleteContactRequest,
    updateStatus,
    bulkUpdateStatus,
    bulkDeleteContactRequests,
    exportContactRequestsToCSV,
    copyEmailToClipboard
  }
}
