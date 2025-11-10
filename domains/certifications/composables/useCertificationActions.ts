import type { Certification } from '../types'
import { useCertificationsStore } from '../stores/useCertificationsStore'
import Swal from 'sweetalert2'

export const useCertificationActions = () => {
  const certificationsStore = useCertificationsStore()
  const router = useRouter()

  /**
   * Confirm and delete a certification
   */
  const confirmAndDeleteCertification = async (certification: Certification): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete this certification?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await certificationsStore.deleteCertification(certification.id)

        await Swal.fire({
          title: 'Deleted!',
          text: 'The certification has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete certification',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  /**
   * Toggle certification active status
   */
  const toggleCertificationStatus = async (certification: Certification): Promise<boolean> => {
    try {
      await certificationsStore.toggleCertificationStatus(certification.id)

      const message = certification.is_active
        ? 'Certification deactivated successfully'
        : 'Certification activated successfully'

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
        text: error.message || 'Failed to update certification',
        icon: 'error'
      })
      return false
    }
  }

  /**
   * Bulk delete certifications
   */
  const bulkDeleteCertifications = async (ids: string[]): Promise<boolean> => {
    if (ids.length === 0) return false

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${ids.length} certification(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await certificationsStore.bulkDelete(ids)

        await Swal.fire({
          title: 'Deleted!',
          text: `${ids.length} certification(s) deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        return true
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete certifications',
          icon: 'error'
        })
        return false
      }
    }

    return false
  }

  /**
   * Export certifications to CSV
   */
  const exportCertificationsToCSV = () => {
    const certifications = certificationsStore.filteredCertifications

    if (certifications.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'No data to export',
        icon: 'warning'
      })
      return
    }

    // CSV headers
    const headers = [
      'ID',
      'Title',
      'Category',
      'Issued Date',
      'Status',
      'Created At',
      'File URL'
    ]

    // CSV rows
    const rows = certifications.map(cert => [
      cert.id,
      cert.title,
      cert.category?.name || 'N/A',
      cert.issued_date || 'N/A',
      cert.is_active ? 'Active' : 'Inactive',
      cert.created_at,
      cert.file_url
    ])

    // Build CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const timestamp = new Date().toISOString().split('T')[0]

    link.setAttribute('href', url)
    link.setAttribute('download', `certifications_${timestamp}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Download certification file
   */
  const downloadCertificationFile = (certification: Certification) => {
    const link = document.createElement('a')
    link.href = certification.file_url
    link.download = `${certification.title}.${certification.file_url.split('.').pop()}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Navigate to certification view
   */
  const viewCertification = (certificationId: string) => {
    router.push(`/certifications/${certificationId}`)
  }

  /**
   * Navigate to certification edit
   */
  const editCertification = (certificationId: string) => {
    router.push(`/certifications/${certificationId}/edit`)
  }

  return {
    confirmAndDeleteCertification,
    toggleCertificationStatus,
    bulkDeleteCertifications,
    exportCertificationsToCSV,
    downloadCertificationFile,
    viewCertification,
    editCertification
  }
}
