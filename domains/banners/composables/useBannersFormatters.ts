export const useBannersFormatters = () => {
  /**
   * Truncate text to a specific length
   */
  const truncate = (text: string, length: number = 100): string => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  /**
   * Format date to localized string
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format date to short format
   */
  const formatDateShort = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  /**
   * Format date and time
   */
  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Get status badge class based on is_active
   */
  const getStatusBadgeClass = (is_active: boolean): string => {
    return is_active ? 'badge-success' : 'badge-secondary'
  }

  /**
   * Get status text based on is_active
   */
  const getStatusText = (is_active: boolean): string => {
    return is_active ? 'Active' : 'Inactive'
  }

  /**
   * Check if banner has CTA
   */
  const hasCta = (cta_text?: string | null, cta_url?: string | null): boolean => {
    return !!(cta_text && cta_url)
  }

  /**
   * Get CTA badge class
   */
  const getCtaBadgeClass = (cta_text?: string | null, cta_url?: string | null): string => {
    return hasCta(cta_text, cta_url) ? 'badge-primary' : 'badge-light'
  }

  /**
   * Get CTA status text
   */
  const getCtaStatusText = (cta_text?: string | null, cta_url?: string | null): string => {
    return hasCta(cta_text, cta_url) ? 'With CTA' : 'Without CTA'
  }

  /**
   * Format image URL for display
   */
  const formatImageUrl = (image_url?: string | null): string => {
    if (!image_url) return '/placeholder-banner.jpg'
    return image_url
  }

  /**
   * Validate image dimensions (min 1920x1080 recommended)
   */
  const validateImageDimensions = async (file: File): Promise<{ valid: boolean; width: number; height: number; message?: string }> => {
    return new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const minWidth = 1920
        const minHeight = 1080

        if (img.width < minWidth || img.height < minHeight) {
          resolve({
            valid: false,
            width: img.width,
            height: img.height,
            message: `Image must be at least ${minWidth}x${minHeight}px. Current size: ${img.width}x${img.height}px`
          })
        } else {
          resolve({
            valid: true,
            width: img.width,
            height: img.height
          })
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve({
          valid: false,
          width: 0,
          height: 0,
          message: 'Unable to load image'
        })
      }

      img.src = objectUrl
    })
  }

  /**
   * Validate URL format
   */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get order badge class
   */
  const getOrderBadgeClass = (order: number): string => {
    if (order === 0) return 'badge-primary'
    if (order === 1) return 'badge-info'
    if (order === 2) return 'badge-success'
    return 'badge-light-primary'
  }

  return {
    truncate,
    formatDate,
    formatDateShort,
    formatDateTime,
    getStatusBadgeClass,
    getStatusText,
    hasCta,
    getCtaBadgeClass,
    getCtaStatusText,
    formatImageUrl,
    validateImageDimensions,
    isValidUrl,
    getOrderBadgeClass
  }
}
