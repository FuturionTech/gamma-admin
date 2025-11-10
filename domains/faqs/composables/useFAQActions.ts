import Swal from 'sweetalert2'
import { useFAQsStore } from '../stores/useFAQsStore'
import type { FAQ } from '../types'

export const useFAQActions = () => {
  const faqsStore = useFAQsStore()

  const confirmAndDeleteFAQ = async (faq: FAQ): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete the FAQ: "${faq.question}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await faqsStore.deleteFAQ(faq.id)

        await Swal.fire({
          title: 'Deleted!',
          text: 'FAQ deleted successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete FAQ',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  const toggleFAQStatus = async (faq: FAQ): Promise<boolean> => {
    try {
      await faqsStore.toggleFAQStatus(faq.id)

      const message = faq.is_active
        ? 'FAQ deactivated successfully'
        : 'FAQ activated successfully'

      await Swal.fire({
        title: 'Success',
        text: message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return true
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to toggle FAQ status',
        icon: 'error'
      })
      return false
    }
  }

  const bulkDeleteFAQs = async (ids: string[]): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Delete ${ids.length} FAQ(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await faqsStore.bulkDelete(ids)

        await Swal.fire({
          title: 'Deleted!',
          text: `${ids.length} FAQ(s) deleted successfully`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete FAQs',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  const exportFAQsToCSV = () => {
    const faqs = faqsStore.filteredFAQs

    if (faqs.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'No data to export',
        icon: 'warning'
      })
      return
    }

    // CSV headers
    const headers = ['ID', 'Question', 'Answer', 'Category', 'Order', 'Status', 'Created At']
    const csvRows = [headers.join(',')]

    // Add FAQ data
    faqs.forEach(faq => {
      const row = [
        faq.id,
        `"${faq.question.replace(/"/g, '""')}"`,
        `"${faq.answer.replace(/"/g, '""')}"`,
        faq.category || '',
        faq.order,
        faq.is_active ? 'Active' : 'Inactive',
        new Date(faq.created_at).toLocaleDateString()
      ]
      csvRows.push(row.join(','))
    })

    // Create blob and download
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `faqs_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    Swal.fire({
      title: 'Success',
      text: 'FAQs exported successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const updateFAQOrder = async (faqId: string, newOrder: number): Promise<boolean> => {
    try {
      await faqsStore.updateFAQOrder(faqId, newOrder)
      return true
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update FAQ order',
        icon: 'error'
      })
      return false
    }
  }

  return {
    confirmAndDeleteFAQ,
    toggleFAQStatus,
    bulkDeleteFAQs,
    exportFAQsToCSV,
    updateFAQOrder
  }
}
