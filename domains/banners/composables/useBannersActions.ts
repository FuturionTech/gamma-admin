import type { Banner } from '../types'
import { useBannersStore } from '../stores/useBannersStore'
import { useBannersFormatters } from './useBannersFormatters'

export const useBannersActions = () => {
  const bannersStore = useBannersStore()
  const { formatDate } = useBannersFormatters()
  const { showSuccess, showError } = useNotification()

  /**
   * Confirm and delete a banner
   */
  const confirmAndDeleteBanner = async (banner: Banner): Promise<boolean> => {
    const confirmMessage = `Are you sure you want to delete the banner "${banner.title}"?`
    const warningMessage = 'This action is irreversible and will permanently delete this banner.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await bannersStore.deleteBanner(banner.id)
      showSuccess('Banner deleted successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete banner')
      return false
    }
  }

  /**
   * Toggle banner active status
   */
  const toggleBannerStatus = async (banner: Banner): Promise<boolean> => {
    const action = banner.is_active ? 'deactivate' : 'activate'

    const confirmed = confirm(
      `Are you sure you want to ${action} the banner "${banner.title}"?`
    )

    if (!confirmed) {
      return false
    }

    try {
      await bannersStore.toggleBannerStatus(banner.id)

      const successMessage = banner.is_active
        ? 'Banner deactivated successfully'
        : 'Banner activated successfully'

      showSuccess(successMessage)
      return true
    } catch (error: any) {
      showError(error.message || 'An error occurred')
      return false
    }
  }

  /**
   * Bulk delete banners
   */
  const bulkDeleteBanners = async (bannerIds: string[]): Promise<boolean> => {
    if (bannerIds.length === 0) {
      showError('No banners selected')
      return false
    }

    const confirmMessage = `Are you sure you want to delete ${bannerIds.length} banner(s)?`
    const warningMessage = 'This action is irreversible and will permanently delete these banners.'

    const confirmed = confirm(`${confirmMessage}\n\n${warningMessage}`)

    if (!confirmed) {
      return false
    }

    try {
      await bannersStore.bulkDelete(bannerIds)
      showSuccess(`${bannerIds.length} banner(s) deleted successfully`)
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to delete banners')
      return false
    }
  }

  /**
   * Export banners to CSV
   */
  const exportBannersToCSV = (): void => {
    const banners = bannersStore.filteredBanners

    if (banners.length === 0) {
      showError('No data to export')
      return
    }

    try {
      // CSV Headers
      const headers = [
        'ID',
        'Title',
        'Subtitle',
        'Image URL',
        'CTA Text',
        'CTA URL',
        'Order',
        'Status',
        'Created At'
      ]

      // CSV Data
      const csvData = banners.map(banner => [
        banner.id,
        banner.title,
        banner.subtitle || '',
        banner.image_url || '',
        banner.cta_text || '',
        banner.cta_url || '',
        banner.order.toString(),
        banner.is_active ? 'Active' : 'Inactive',
        formatDate(banner.created_at)
      ])

      // Escape CSV fields
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
      link.setAttribute('download', `banners-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showSuccess('Export successful')
    } catch (error: any) {
      console.error('Error exporting CSV:', error)
      showError('Failed to export banners')
    }
  }

  /**
   * Duplicate a banner
   */
  const duplicateBanner = async (banner: Banner): Promise<boolean> => {
    try {
      const newBanner = {
        application_id: banner.application_id,
        title: `${banner.title} (Copy)`,
        subtitle: banner.subtitle,
        image_url: banner.image_url,
        cta_text: banner.cta_text,
        cta_url: banner.cta_url,
        order: bannersStore.banners.length, // Add at the end
        is_active: false // Start as inactive
      }

      await bannersStore.createBanner(newBanner)
      showSuccess('Banner duplicated successfully')
      return true
    } catch (error: any) {
      showError(error.message || 'Failed to duplicate banner')
      return false
    }
  }

  /**
   * Upload banner image
   */
  const uploadBannerImage = async (file: File): Promise<string | null> => {
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Unsupported image format. Use JPG, PNG, or WebP.')
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Image is too large. Maximum size: 5 MB.')
      }

      // TODO: Implement actual upload to storage service
      // For now, we'll use a placeholder URL
      // In production, integrate with your storage service (S3, Cloudinary, etc.)

      const formData = new FormData()
      formData.append('file', file)

      // Example upload endpoint - replace with actual endpoint
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()
      // return data.url

      // Temporary: Create object URL for preview
      const objectUrl = URL.createObjectURL(file)
      return objectUrl
    } catch (error: any) {
      showError(error.message || 'Failed to upload image')
      return null
    }
  }

  return {
    confirmAndDeleteBanner,
    toggleBannerStatus,
    bulkDeleteBanners,
    exportBannersToCSV,
    duplicateBanner,
    uploadBannerImage
  }
}
